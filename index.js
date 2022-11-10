const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
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

    // Foods API
    app.get("/limFoods", async (req, res) => {
      const query = {};
      const cursor = foodsCollection.find(query);
      const limFoods = await cursor.limit(3).toArray();
      res.send(limFoods);
    });
  } catch (error) {
    console.log(error);
  }
}
run().catch((err) => console.error(err));

app.listen(port, () => console.log(`YourMeals app listening on port ${port}`));
