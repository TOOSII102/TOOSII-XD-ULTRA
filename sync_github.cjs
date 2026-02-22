const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

async function getAccessToken() {
  const h = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const t = process.env.REPL_IDENTITY ? 'repl ' + process.env.REPL_IDENTITY : process.env.WEB_REPL_RENEWAL ? 'depl ' + process.env.WEB_REPL_RENEWAL : null;
  let cs = await fetch('https://' + h + '/api/v2/connection?include_secrets=true&connector_names=github', { headers: { 'Accept': 'application/json', 'X_REPLIT_TOKEN': t } }).then(r => r.json()).then(d => d.items?.[0]);
  return cs?.settings?.access_token || cs?.settings?.oauth?.credentials?.access_token;
}

function getAllFiles(dir, base = '') {
  let results = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const rel = base ? base + '/' + f : f;
    if (fs.statSync(full).isDirectory()) {
      if (f === 'node_modules' || f === '.git' || f === 'auth_info') continue;
      results = results.concat(getAllFiles(full, rel));
    } else {
      results.push({ rel, full });
    }
  }
  return results;
}

async function getGitHubTree(octokit, owner, repo) {
  try {
    const { data: ref } = await octokit.git.getRef({ owner, repo, ref: 'heads/main' });
    const { data: commit } = await octokit.git.getCommit({ owner, repo, commit_sha: ref.object.sha });
    const { data: tree } = await octokit.git.getTree({ owner, repo, tree_sha: commit.tree.sha, recursive: 'true' });
    return { files: tree.tree.filter(t => t.type === 'blob'), commitSha: ref.object.sha };
  } catch {
    return { files: [], commitSha: null };
  }
}

async function main() {
  const token = await getAccessToken();
  const octokit = new Octokit({ auth: token });
  const owner = 'TOOSII102', repo = 'TOOSII-XD-ULTRA';
  const botDir = '/home/runner/workspace/bot';

  const localFiles = getAllFiles(botDir);
  const { files: ghFiles, commitSha } = await getGitHubTree(octokit, owner, repo);
  const ghMap = {};
  for (const f of ghFiles) ghMap[f.path] = f.sha;

  console.log(`Local files: ${localFiles.length}`);
  console.log(`GitHub files: ${ghFiles.length}`);

  const toUpload = [];
  for (const { rel, full } of localFiles) {
    const content = fs.readFileSync(full);
    const blob = require('crypto').createHash('sha1')
      .update('blob ' + content.length + '\0')
      .update(content).digest('hex');
    if (!ghMap[rel] || ghMap[rel] !== blob) {
      toUpload.push({ rel, full, content });
    }
  }

  // Also check for README.md and other root files that might have been pushed separately
  console.log(`\nFiles needing update: ${toUpload.length}`);
  for (const f of toUpload) console.log(`  - ${f.rel}`);

  if (toUpload.length === 0) {
    console.log('\nAll files are up to date on GitHub!');
    return;
  }

  // Create blobs and new tree
  const treeItems = [];
  for (const f of toUpload) {
    console.log(`Uploading: ${f.rel}`);
    const { data: blob } = await octokit.git.createBlob({
      owner, repo,
      content: f.content.toString('base64'),
      encoding: 'base64'
    });
    treeItems.push({ path: f.rel, mode: '100644', type: 'blob', sha: blob.sha });
  }

  const { data: ref } = await octokit.git.getRef({ owner, repo, ref: 'heads/main' });
  const latestSha = ref.object.sha;

  const { data: newTree } = await octokit.git.createTree({
    owner, repo,
    base_tree: latestSha,
    tree: treeItems
  });

  const { data: newCommit } = await octokit.git.createCommit({
    owner, repo,
    message: 'Sync all bot files - latest updates',
    tree: newTree.sha,
    parents: [latestSha]
  });

  await octokit.git.updateRef({
    owner, repo,
    ref: 'heads/main',
    sha: newCommit.sha
  });

  console.log(`\nPushed ${toUpload.length} files to GitHub!`);
  console.log(`Commit: ${newCommit.sha}`);
  console.log('https://github.com/TOOSII102/TOOSII-XD-ULTRA');
}

main().catch(e => { console.error(e.message); process.exit(1); });
