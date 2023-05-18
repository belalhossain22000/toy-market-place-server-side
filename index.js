const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 5000;
//turboToy
//muActq32FGgOoIXr

//middleware
app.use(cors());
app.use(express.json());

//mongodb connection configuration

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dp3om9f.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    //database and collection
    const toyCollections = client.db("toyCollectionsDB").collection("toy");

    //start crud from here
    // Create an item
    app.post("/addToys", (req, res) => {
      const newToy = req.body;
      toyCollections
        .insertOne(newToy)
        .then((result) => {
          res.send(result);
        })
        .catch((error) => {
          res.status(500).json({ error: "Error creating item" });
        });
    });

    // Get all items
    app.get("/allToys", (req, res) => {
      toyCollections
        .find()
        .toArray()
        .then((toys) => {
          res.send(toys);
        })
        .catch((error) => {
          res.status(500).json({ error: "Error getting items" });
        });
    });

    // Get a single item
    app.get("/toy/:id", (req, res) => {
      const toyId = req.params.id;
      toyCollections
        .findOne({ _id: new ObjectId(toyId) })
        .then((toy) => {
          if (!toy) {
            res.status(404).json({ error: "Item not found" });
          } else {
            res.send(toy);
          }
        })
        .catch((error) => {
          res.status(500).json({ error: "Error getting item" });
        });
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
  res.send("TurboToy server is running ");
});

app.listen(port, () => {
  console.log(`server  listening on port ${port}`);
});
