const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

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
    console.log("Pinged your deployment. You successfully connected to MongoDB from User.js!");
} finally {
    // Ensures that the client will close when you finish/error
    await client.close();
}
}
run().catch(console.dir);

mongoose.connect(uri);

const UserSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose); //Create a plugin

const User = mongoose.model('User', UserSchema);

module.exports = User;