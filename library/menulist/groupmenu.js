const groupMenu = `
╔══════════════════════════╗
║  👥  *GROUP MANAGEMENT*
╚══════════════════════════╝
  ├ .add        › [number]
  ├ .kick       › @user
  ├ .remove     › @user
  ├ .promote    › @user
  ├ .demote     › @user
  ├ .ban        › @user
  ├ .unban      › @user
  ├ .warn       › @user [reason]
  ├ .unwarn     › @user
  ├ .resetwarn  › @user
  ├ .warnlist
  ├ .approve    › [all/number]
  ├ .reject     › [all/number]
  ├ .delete     › reply msg
  ├ .mute  ├ .unmute
  └ .open  └ .close

╔══════════════════════════╗
║  ⚙️  *GROUP SETTINGS*
╚══════════════════════════╝
  ├ .setgname › [name]
  ├ .setgdesc › [desc]
  ├ .setgpp   › reply img
  ├ .link     ├ .resetlink
  ├ .revoke
  ├ .welcome  › on/off
  ├ .goodbye  › on/off
  ├ .greet    › on/off
  ├ .left     › on/off
  └ .events   › on/off

╔══════════════════════════╗
║  🛡️  *PROTECTION*
╚══════════════════════════╝
  ├ .antilink     › on/off
  ├ .antibadword  › on/off
  ├ .antitag      › on/off
  ├ .antisticker  › on/off
  ├ .antidemote   › on/off
  └ .antibot      › on/off/scan/add/list

╔══════════════════════════╗
║  🔧  *GROUP TOOLS*
╚══════════════════════════╝
  ├ .tagall    › [msg]
  ├ .tag       › [msg]
  ├ .hidetag   › [msg]
  ├ .tagnoadmin › [msg]
  ├ .mention   › [msg]
  ├ .groupinfo
  ├ .admins
  ├ .vcf
  ├ .leave
  └ .clear`

module.exports = groupMenu
