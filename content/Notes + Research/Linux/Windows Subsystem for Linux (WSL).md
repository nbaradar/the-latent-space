---
title: Windows Subsystem for Linux (WSL)
tags:
  - linux
  - windows
  - wsl
  - research
draft:
---
## Navigating Directories in Windows Explorer
If you want to view WSL directories in File Explorer, the correct way is to open the directories through a **NETWORK PATH** by opening a file explorer and using this address:
```ruby
\\wsl$
```

You can also specify the distro like so:
```ruby
\\wsl$\Ubuntu
```

And finally you can just open WSL, navigate to the folder, then run 
```bash
explorer.exe .
```
Which will open a file explorer at that location. 

