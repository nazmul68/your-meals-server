const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Port
const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("YourMeals server is running!"));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pdzsrjb.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const foodsCollection = client.db("YourMeals").collection("Foods");

    // Meals API
    //limited meals API
    app.get("/limMeals", async (req, res) => {
      const query = {};
      const cursor = foodsCollection.find(query);
      const limFoods = await cursor.limit(3).toArray();
      res.send(limFoods);
    });

    // all meals API
    app.get("/allMeals", async (req, res) => {
      const query = {};
      const cursor = foodsCollection.find(query);
      const limFoods = await cursor.toArray();
      res.send(limFoods);
    });

    // get specific meal by id API
    app.get("/allMeals/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const food = await foodsCollection.findOne(query);
      res.send(food);
    });
  } catch (error) {
    console.log(error);
  }
}
run().catch((err) => console.error(err));

app.listen(port, () => console.log(`YourMeals app listening on port ${port}`));
