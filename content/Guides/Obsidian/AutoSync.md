---
title: AutoSync
description: A guide on how to automatically sync your local Obsidian Vaults with your remote Github Repos so your backed up notes will always be up-to-date.
draft: false
tags:
  - obsidian
  - guide
date: 2025-06-10
---
> [!warning] This section was written very quickly. I will update it with more detail later.
## Step 1: AutoSync Bash Script
We'll need a script that automates the entire sync process and logs the outcome for you. 
I have created a script, all you need to do is save it somewhere on your computer and add your Vault locations to the script. I know the use of emojis in software development is controversial, but I like them for logs. You can remove them, they start/end with `:`


>[info]


Specifically you need to tell it where your vaults are by giving it the file-path to your vault(s). Add it under the variable `VAULT_PATHS`

## Step 2: CronJob for Script Automation
Then add that script to your crontab (MacOS)
This is very easy. Just open a terminal, issue this command:
```bash
crontab -e
```

Then you'll see a text editor (vi) in your terminal:

![[Pasted image 20250610170510.png]]

Copy this to your clipboard
```crontab
0 0,6,12,18 * * * /bin/bash /Users/naderbaradar/obsidian_autosync.sh
```

Then go back to the terminal and press `i` on your keyboard to enter "Insert" mode and paste the line:
![[Pasted image 20250610170710.png]]

Finally, press `:` (colon) to enter "Command" mode and then type in `wq`

![[Pasted image 20250610170831.png]]

This will `w`rite to the file and `q`uit the text editor (vi). You have now scheduled your script to run automatically everyday at these times:
- 12:00 AM
- 06:00 AM
- 12:00 PM
- 06:00 PM

If you want to change the times/frequency you can play with the Crontab line.

Finally, you can validate that crontab registered your cronjob automation by issuing the `crontab -l` command, and you should see your cron job listed.
```
naderbaradar@Naders-MacBook-Air development_workspace % crontab -l

0 0,6,12,18 * * * /bin/bash /Users/naderbaradar/obsidian_autosync.sh
```

> [!tip] IMPORTANT
For crontab to work you may need to give it full disk access (depending on where your obsidian vault is stored. Mine is stored in my iCloud directory)
#### Steps:
1. Open **System Settings**
2. Go to **Privacy & Security → Full Disk Access**
3. Click the **`+`** button
4. Press `Cmd + Shift + G` and enter:
   `/usr/sbin/cron`


