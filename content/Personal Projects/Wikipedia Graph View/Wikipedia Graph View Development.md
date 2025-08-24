---
title: Wikipedia Graph View Development
tags:
  - lab
  - windsurf
  - projects
draft:
---
>[!important] POC Notes can be found here: 
> [[Wikipedia Graph View POC|<- Wikipedia Graph View POC]]
# Setting up Claude Code
I need to set up configs and some `Claude.md` and hook files if I want to use ClaudeCode well. 

---
# Additional Features
## Node Filtering
Currently we are generating them alphabetically. This is somewhat useless. I need to create more "modes" for viewing. 
- Alphabetical
- Link Order in Article
- Page Weights (order page generation by how many links a related page has. So if the node page is battery and the related pages are "electricity", "panasonic", and "Assault" then it would count the number of linked articles for each and generate/display in that order)
- Page Popularity (How much traffic the page gets?)
## Increase/Decrease Layers
Create a slider from 1-10 that let's you generate more layers for each node. This needs to be implemented carefully. 
Maybe I should cap it so you can go up to 5 layers for now, and each generated node in each layer can only generate 1-5 additional nodes. That's still has the potential to quickly scale into chaos though.
## Rabbit Hole mode VS Standard Mode
Standard = Generate article when you click a node
Rabbit Hole = Generate article + replace central node with the selected node/re-generate. This means every time you click a node you are making that the central node and re-generating the graph
## Update Graph Animations
Right now, lines are generated first, then nodes are slowly generated and appear. This looks slow. 
We should generate the nodes first and as they slowly appear then generate the lines. Not wait for the lines to finish and then generate nodes. 
If anything they should both start at the same time and it would match well. 
