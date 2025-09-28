const express = require('express');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const port = 3000;

// Replace with your MongoDB connection string
const uri = 'mongodb+srv://Madhan:<password>@cluster0.y0vtta6.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);
let db;

async function connectDB() {
    await client.connect();
    db = client.db('locationDB'); // Database name
    console.log('Connected to MongoDB');
}

connectDB().catch(console.error);

app.use(express.json());
app.use(cors()); // Allow cross-origin requests

// Endpoint to upload location
app.post('/upload-location', async (req, res) => {
    const { lat, long } = req.body;
    if (!lat || !long) {
        return res.status(400).json({ error: 'Missing lat or long' });
    }
    const id = uuidv4(); // Generate unique ID
    try {
        const collection = db.collection('locations');
        await collection.insertOne({ id, lat, long });
        res.json({ id });
    } catch (error) {
        res.status(500).json({ error: 'Error inserting data' });
    }
});

// Endpoint to get all locations
app.get('/locations', async (req, res) => {
    try {
        const collection = db.collection('locations');
        const locations = await collection.find({}).toArray();
        res.json(locations.map(loc => ({ id: loc.id, lat: loc.lat, long: loc.long })));
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
