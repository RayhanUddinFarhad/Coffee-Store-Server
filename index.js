const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT  || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();




app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.edrit7p.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("Coffeedatabse");
    const coffeeCollections = database.collection("coffees");

    app.post ('/coffee', async(req, res) => { 

        const body = req.body;


        const result = await coffeeCollections.insertOne(body);
        res.send (result);







    })

    app.get ('/coffee', async(req, res) => {





        const cursor = coffeeCollections.find();
        const result = await cursor.toArray()

        res.send (result)

     })


     app.get ('/coffee/:id', async (req, res) => {

        const id = req.params.id;

        const query = { _id : new ObjectId (id) };


        const result = await coffeeCollections.findOne(query);

        res.send (result)







      })

     app.delete ( '/coffee/:id', async(req, res) => {



        const id = req.params.id;

        const query = { _id : new ObjectId (id) };

        const result = await coffeeCollections.deleteOne(query);

        res.send (result);


      })

      app.put ('/coffee/:id', async (req, res) => {

        const id = req.params.id;
        const body = req.body;



        const filter = { _id : new ObjectId (id) };


        const options = { upsert: true };
        const updateDoc = {
            $set: {
            name : body.name,
            quantity : body.quantity,
            supplier : body.supplier,
            taste : body.taste,
            category : body.category,
            detais : body.detais,
            photo : body.photo

            },
          };


          const result = await coffeeCollections.updateOne(filter, updateDoc, options);


          res.send (result);







       })








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get ('/', (req, res) => { 


    res.send ("Welcome to the coffee server!");

})

app.listen (port, (req, res) => { 


    console.log  ("Server listening on port " + port)
})