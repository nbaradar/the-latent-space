>[!note]
>[Cheat Sheet](https://www.mongodb.com/developer/products/mongodb/cheat-sheet/)
# Helpers
Show Database
```
show dbs
db // prints the current database
```

Switch Database
```
use <database_name>
```

Show Collections
```
show collections
```

Run Javascript File
```
load("myScript.js")
```
# CRUD Operations
#### Create
```javascript
db.coll.insertOne({name: "Max"})
db.coll.insertMany([{name: "Max"}, {name:"Alex"}]) // ordered bulk insert
db.coll.insertMany([{name: "Max"}, {name:"Alex"}], {ordered: false}) // unordered bulk insert
db.coll.insertOne({date: ISODate()})
db.coll.insertOne({name: "Max"}, {"writeConcern": {"w": "majority", "wtimeout": 5000}})
```
