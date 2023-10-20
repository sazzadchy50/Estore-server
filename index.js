const express = require('express');
require('dotenv').config()
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require('mongodb');

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
    }
  });



  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      const brandCollection = client.db('brandDB').collection('brand');
  
      // app.get('/brand/:name', async (req, res) => {
      //   const id = req.params.id;
      //   const query = { _id: new ObjectId(id) };
      //   const user = await userCollection.findOne(query);
      //   console.log(user);
      //   res.send(user)
      // });

      app.get('/brands/:name', async (req, res) => {
        const brandName = req.params.name;
        const brandData = await brandCollection.findOne({ brand: brandName });
      
        if (brandData) {
          res.json(brandData);
        } else {
          res.status(404).json({ message: 'Brand not found' });
        }
      });

      app.post('/brands', async(req, res)=>{
          const newBrand = req.body;
          console.log(newBrand);
          const result = await brandCollection.insertOne(newBrand)
          res.send(result)
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

  app.get("/", (req, res) => {
    res.send("brand server running");
  });
  
  app.listen(port, () => {
    console.log(`brand server is running in  ${port}`);
  });
  