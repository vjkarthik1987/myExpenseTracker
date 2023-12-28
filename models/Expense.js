const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categories = require('./Category');
const modes = require('./Mode');
const User = require('./User');

// Connecting mongoose
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

async function run() {
try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB from Expense JS!");
} finally {
    // Ensures that the client will close when you finish/error
    await client.close();
}
}
run().catch(console.dir);

mongoose.connect(uri);


const ExpenseSchema = new Schema({
    item: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: categories
    },
    mode: {
        type: String,
        required: true,
        enum: modes
    },
    month: Number,
    dayOfWeek: Number,
    year: Number,
    shop: String,
    note: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

const Expense = mongoose.model('Expense', ExpenseSchema);
module.exports = Expense;