const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://car-stock2:gJ44IcdzNGHD3rlp@cluster0.u9jru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const carsCollection = client.db("carStock").collection("cars");

    //get the cars data
    app.get("/cars", async (req, res) => {
      const query = {};
      const cursor = carsCollection.find(query);
      const cars = await cursor.toArray();
      res.send(cars);
    });

    //post or add data to the car collection
    app.post("/cars", async (req, res) => {
      const newCar = req.body;
      const result = await carsCollection.insertOne(newCar);
      res.send(result);
    });

    //get the exact car data by id
    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carsCollection.findOne(query);
      res.send(result);
    });

    // update the car data
    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCar = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: updatedCar.name,
          description: updatedCar.description,
          quantity: updatedCar.quantity,
          price: updatedCar.price,
          image: updatedCar.image,
        },
      };
      const result = await carsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //delete the data from database and api
    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carsCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Node is running Successfully");
});

app.listen(port, () => {
  console.log("CRUD server is running Successfully");
});
