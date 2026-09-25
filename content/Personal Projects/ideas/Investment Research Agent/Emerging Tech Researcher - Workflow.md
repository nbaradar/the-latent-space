How do I find the moment where an idea is becoming a product?
## Core Task
Given a computing subdomain and a point-in-time cutoff:
> Identify important technical developments that appear to be moving toward commercialization, map the companies meaningfully exposed to those developments, and rank which companies deserve deeper investment research.

---

How would you accomplish this task? 
First you need to find your sources., things like arxiv, github, connectedpapers, googlescholar, etc. I have no idea yet, I just know I need to find them. 

Then you actually look for papers. You should find influential papers that... 
- have >x number of reference from other papers
- They have cross-field references to spread beyond their immediate niche
- a code repository ( with x number of forks/stars/contributors and high branch activity)
- Can we use the Disruption Index to measure a papers displacement? https://direct.mit.edu/qss/article/doi/10.1162/QSS.a.409/134801/The-Disruption-Index-measures-displacement-between
- The number of authors on a paper (large author groups of 6 or more are common for breakthrough papers)
- Co-Citation network bridge: if a new paper is cited together with papers from a different sub-domain
- citation rate/velocity within 90 days of it's initial publication
- Textual "Semantic Displacement": A breakthrough paper disrupts the established jargon of its sub-domain, introducing new keywords or frameworks that subsequent papers copy
	- If other papers adopt new terminology from a paper, the original paper could be considered a root breakthrough
- Because Breakthrough papers fracture the field, check if earlier citations contain less topical cohesion since this would mean a foundational mechanism may have been introduced, not just an incremental innovation in a sub domain. 

Then you may want to add another pass where you "weigh" the papers in order from highest likelihood of breakthrough to lowest just to have a representation. I'm not sure how to weigh this yet, it depends on some of the findings up above
After finding papers that match the criteria, you need to track movement of the authors on each paper and where they are currently employed if they left research. Note those places they moved to, especially if they were pivotal to the research paper. 
Then you need to then track startups and companies that are connected to those innovations as well. 
Then you have a list of companies, some of which may be tied to researchers from the papers that were already chosen. You need another pass where you "weigh" these companies
Then you want to do research on companies, and you may want to limit which ones you research based on the results of the last pass. 
Then continue.... at this point I wrote enough where I think building the process of finding breakthrough papers is already a good unit of work. 

Also, I think the steps where we do a pass to "weigh" results is a good point to make adjustments as well for when we test our agent and evaluate it's success. We can fine tune how we weigh things in this step as additional configuration if needed. 

---

Okay, I need to pick a couple signals for the paper ranking that can help me learn AI engineering skills

### **Semantic novelty**
Ask: _How different is this paper from the dominant ideas in its subdomain before the cutoff date?_

This gives you experience with embeddings, similarity search, retrieval windows, clustering, structured LLM judgments, and point-in-time corpora.

### **Downstream concept adoption**  (Semantic Displacement)
Ask: _Do later papers begin using this paper’s concepts, terminology, methods, or framing?_

This gives you temporal retrieval, semantic comparison, lineage/provenance, and potentially a combination of deterministic NLP + LLM classification.

### **Cross-domain transfer**  
Ask: _Is the idea beginning to appear outside the original research niche?_

For example, something that originated in computer vision starts appearing in robotics or medicine.

This gives you embeddings/clustering, taxonomy problems, graph reasoning, ambiguous classification, and eval questions like “what counts as another domain?”

### **Research → implementation transition**  
Ask: _Is somebody actually building this?_

Signals could include:

- linked GitHub repos
- independent implementations
- forks/contributors
- libraries incorporating the method
- benchmark reproductions

This teaches tool use, heterogeneous data retrieval, entity resolution, structured extraction, and evidence synthesis.

### **Research → organization transition**  
Ask: _Are the people associated with the work moving into companies, founding startups, being acquired, or being hired into relevant teams?_

This is excellent AI-engineering territory because it is messy.

You have to resolve:

- “Is this the same researcher?”
- “Did this startup actually originate from this lab?”
- “Is this company connection meaningful or superficial?”

That gives you entity resolution, confidence scores, multiple-source verification, agentic follow-up, and hallucination control.

### **Commercialization evidence**  
Ask: _Is there evidence that somebody is trying to turn the technical capability into an economically useful product?_

Not “does an LLM think this sounds commercially important?”

Actual evidence:

- product launches
- customers
- partnerships
- developer APIs
- patents
- acquisitions
- cloud-service support
- hardware support

This gives you the most interesting reasoning problem: synthesizing weak evidence from multiple modalities/sources into a bounded judgment.

### **Evidence disagreement / uncertainty**  
I would actually make this a first-class signal.

Ask:

> “How much of the evidence agrees that this development is significant?”

If citations look huge but nobody implements it, that's interesting. If GitHub adoption is exploding but academic citations are low, that's also interesting.

This creates opportunities to build model critique, confidence calibration, evidence weighting, and “research further vs stop” logic.