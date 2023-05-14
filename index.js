const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// dotenv
require('dotenv').config()

const port = process.env.PORT || 5000

// middleware
app.use(express.json())
app.use(cors())

console.log(process.env.DB_PASS);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.khwex9e.mongodb.net/?retryWrites=true&w=majority`;

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
        // step 1
        const serviceCollection = client.db('carsDoctor').collection('services')

        const bookingCollection = client.db('carsDoctor').collection('bookings')

        // step 2 all data show done
        app.get('/services', async (req, res) => {


            const cursor = serviceCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // step 3 single data show /ekta ekta data show
        app.get('/services/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: new ObjectId(id) }


            const options = {

                // Include only the `title` and `imdb` fields in the returned document
                projection: { title: 1, price: 1, service_id: 1 },
            };




            const result = await serviceCollection.findOne(query, options)
            res.send(result)
        })



        // booking

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking);
            const result = await bookingCollection.insertOne(booking)
            res.send(result)
        });






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

        // await client.close();

    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Car Doctor is running ')
})

app.listen(port, () => {
    console.log(`car doctor server is running on port:${port}`);
})