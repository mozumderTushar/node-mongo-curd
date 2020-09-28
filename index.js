const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const password = 'd53Ns9ZKwG5LyHV'

const uri = "mongodb+srv://organicUser:d53Ns9ZKwG5LyHV@cluster0.jos17.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})




client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");

  app.get("/products", (req, res) => {
      productCollection.find({})
      .toArray((err, documents) => {
          res.send(documents)
      })
  });
  
  app.get("/product/:id", (req, res) => {
      productCollection.find({_id: ObjectId(req.params.id)})
      .toArray((err, documents) => {
          res.send(documents[0])
      })
  })

  app.post("/addProduct", (req, res) => {
      const product = req.body;
      productCollection.insertOne(product)
      .then(result =>{
          console.log('data added successfully');
          res.redirect('/')
      })
  })

  app.patch('/update/:id', (req, res) => {
      productCollection.updateOne({_id: ObjectId(req.params.id)},
      {
        $set: {price: req.body.price, quantity: req.body.quantity}
      } )
      .then(result => {
        res.send(result.modifiedCount > 0)
    })
  })

  app.delete('/delete/:id',(req, res) =>{
    // console.log(req.params.id)
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
        res.send(result.deletedCount > 0);
    })
   
//   client.close();
})


})


app.listen(3000);