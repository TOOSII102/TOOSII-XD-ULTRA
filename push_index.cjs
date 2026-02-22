const { Octokit } = require('@octokit/rest');
const fs = require('fs');

async function getAccessToken() {
  const h = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const t = process.env.REPL_IDENTITY ? 'repl ' + process.env.REPL_IDENTITY : process.env.WEB_REPL_RENEWAL ? 'depl ' + process.env.WEB_REPL_RENEWAL : null;
  let cs = await fetch('https://' + h + '/api/v2/connection?include_secrets=true&connector_names=github', { headers: { 'Accept': 'application/json', 'X_REPLIT_TOKEN': t } }).then(r => r.json()).then(d => d.items?.[0]);
  return cs?.settings?.access_token || cs?.settings?.oauth?.credentials?.access_token;
}

async function main() {
  const token = await getAccessToken();
  const octokit = new Octokit({ auth: token });
  const owner = 'TOOSII102', repo = 'TOOSII-XD-ULTRA';

  const content = fs.readFileSync('/home/runner/workspace/bot/index.js');
  let sha;
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: 'index.js' });
    sha = data.sha;
  } catch {}

  await octokit.repos.createOrUpdateFileContents({
    owner, repo,
    path: 'index.js',
    message: 'Add professional colored console output with ANSI codes',
    content: content.toString('base64'),
    sha
  });
  console.log('index.js pushed to GitHub!');
}
main().catch(e => { console.error(e.message); process.exit(1); });
