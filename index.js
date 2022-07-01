const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swrgc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("todos").collection("tasks");

    // TASK - GET API
    app.get("/task", async (req, res) => {
      const query = {};
      const cursor = taskCollection.find(query);
      const tasks = await cursor.toArray();
      res.send(tasks);
    });

    // TASK - DELETE API
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    // TASK - POST API
    app.post("/task", async (req, res) => {
      const newTask = req.body;
      const result = await taskCollection.insertOne(newTask);
      res.send(result);
    });

    //GET SINGLE TASK API
    app.get("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const task = await taskCollection.findOne(query);
      res.send(task);
    });

    //SINGLE TASK UPDATE
    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const updatedTask = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateData = {
        $set: {
          task: updatedTask.task,
        },
      };
      const result = await taskCollection.updateOne(
        filter,
        updateData,
        options
      );
      res.send(result);
    });

    //TASK COMPLETE API
    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const completedTask = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: completedTask.stutas,
        },
      };
      const result = await taskCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Manager Api");
});

app.listen(port, () => {
  console.log(`Task Manager listening on port ${port}`);
});
