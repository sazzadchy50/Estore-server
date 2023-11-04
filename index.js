const express = require("express");
const jwt = require("jsonwebtoken")
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wsx9xso.mongodb.net/?retryWrites=true&w=majority`;

console.log(process.env.DB_USER);
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
    const brandCollection = client.db("brandDB").collection("brand");

    const cartCollection = client.db("cartDB").collection("cart");

    app.get("/brand/:brandName", async (req, res) => {
      const brand = req.params.brandName;
      const query = { brandName: brand };
      const result = await brandCollection.find(query).toArray();

      res.send(result);
    });

    app.get("/brand/:brandName/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandCollection.findOne(query);
      res.send(result);
    });

    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/brand", async (req, res) => {
      const newBrand = req.body;
      console.log(newBrand);
      const result = await brandCollection.insertOne(newBrand);
      res.send(result);
    });

    app.put("/brand/:brandName/:id", async(req, res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true };
        const updateProduct  = req.body;
        const updateDoc = {
          $set: {
          image: updateProduct.image,
          name: updateProduct.name,
          brandName: updateProduct.brandName,
          price: updateProduct.price,
          rating: updateProduct.rating,
          shortDescription: updateProduct.shortDescription,
          type: updateProduct.type,
          details:updateProduct.details
        }
        } 
        const result = await brandCollection.updateOne(filter, updateDoc, options )
        console.log('update result:', result);
        res.send(result)
    });

    app.post("/addToCart/:id", async (req, res) => {
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    });

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
  res.send("brand server running");
});

app.listen(port, () => {
  console.log(`brand server is running in  ${port}`);
});
