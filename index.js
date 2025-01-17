const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrlryfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("techGadgets").collection("users");
    const productCollection = client.db("techGadgets").collection("products");

    //  Post User to Mongodb
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Get users
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // Post a Product
    app.post('/addProduct', async (req, res)=>{
      const productInfo = req.body;
      const result = await productCollection.insertOne(productInfo);
      res.send(result);
    })

    // Get a Product
    app.get('/addProduct', async (req, res)=>{
      const id = req.params.id;
      const result = await productCollection.find().toArray(id);
      res.send(result);
    })

    // Get Product Details API
    app.get('/singleProduct/:id', async (req, res)=>{
      const id = { _id: new ObjectId(req.params.id) }
      const result = await productCollection.findOne(id);
      res.send(result);
    })

    // Get Product Details Update API
    app.put('/updateProduct/:id', async (req, res)=>{
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) }
      const data = {
        $set : {
          name: req.body.name,
          price: req.body.price
        }
      }
      const result = await productCollection.updateOne(query, data)
      res.send(result);
    })

    // Delete Product API in Cart Page
    app.delete('/delete/:id', async (req, res)=>{
      const query = { _id: new ObjectId(req.params.id) };
      const result = await productCollection.deleteOne(query);
      res.send(result); 
    })

    // Get a Product by email in My Cart Page
    app.get('/myProduct/:email', async (req, res)=>{
      const email = req.params.email;
      const result = await productCollection.find({email}).toArray();
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("tech is running");
});

app.listen(port, () => {
  console.log(`Tech Gadgets server is running on port: ${port}`);
});
