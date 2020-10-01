const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const uri = "mongodb+srv://organicFood:kzr3END2b17IgQ1L@cluster0.ffemf.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html');
})



client.connect(err => {
  const collection = client.db("organicdb").collection("product");

  app.get('/products', (req, res) => {
    collection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    } )
  })

  app.get('/products/:id', (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      res.send(documents[0]);
    })
  })
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    collection.insertOne(product)
  .then(result => {console.log("One Product Added")});
  res.redirect('/');
  })

  app.patch('/update/:id', (req, res) => {
    collection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {email: req.body.email, phone: req.body.phone}
    })
    .then(result => {
      res.send(result.modifiedCount > 0);
    })
  })
  app.delete('/delete/:id', (req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      res.send(result.deletedCount > 0);
    })
  })
});

app.listen(3000);