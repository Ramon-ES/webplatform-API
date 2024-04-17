const express = require('express');
const mongoose = require('mongoose');
const Client = require('./src/models/client');
const cors = require('cors');

const app = express();
mongoose.set('strictQuery', false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

const testJSON = {
    "speakers": [
        { "name": "Sara", "role": "leader", "voice": "voicemodel-female" },
        { "name": "David", "role": "target", "voice": "voicemodel-male" },
        { "name": "James", "role": "support", "voice": "voicemodel-male" }
    ],
    "introduction": [
        { "Speaker": "Sarah", "text": "Hoi allen, wat is de status?", "mood": "None" },
        { "Speaker": "David", "text": "Alles gaat fout, ik trek het niet meer", "mood": "Sadness" },
        { "Speaker": "Sarah", "text": "Dat is jammer om te horen David, maar je moet gewoon door.", "mood": "Rage" },
    ],
    "briefing": "David is overspannen en krijgt zijn werk niet af. Jij gaat hem feedback geven om samen op een oplossing te komen.",
    "character-profile": {
        "name": "David",
        "maxAnnoyance": 5,
        "defaultMood": "Indignation",
        "annoyedMood": "Aversion",
        "maxMood": "Revulsion",
        "goodFeedbackMood": "Amusement",
        "role": "Accountant responsible for creating weekly reports detailing the cash-flow of the company.",
        "backround": "David comes from a small family, he is broke and desperate to work. Lately he's struggled with meeting quota's as his newborn isn't allowing him to get a single night's rest. ",
        "attitude": "David tends to be stressed, he is not open to feedback and prefers to keep to himself. He avoids the truth of the situation."
    }
}

// post and put is to replace whole object
// patch is to update single property

app.get('/testJSON', (req, res) => {
    res.send(({ "data": testJSON }));
});
app.post('/testJSON', (req, res) => {
    console.log(req.body);
    res.send((req.body));
});

// log data from database, only to debug. for example:
// console.log(await mongoose.connection.db.listCollections().toArray());

// retrieve data from database and return it
app.get('/data', async (req, res) => {
    try {
        const result = await Client.find();
        res.send(({ "data": result }));
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

app.get('/data/:id', async (req, res) => {
    console.log({
        requestParams: req.params,
        requestQuery: req.query
    });
    try {
        // finding entry by its id
        const { id: clientId } = req.params;
        console.log(clientId);
        const client = await Client.findById(clientId);
        console.log(client);
        if (!client) {
            res.status(404).json({ error: 'user not found' });
        } else {
            res.json({ client });
        }
    } catch (e) {
        res.status(500).json({ error: 'something went wrong' });
    }
});

// calling and replace whole inner object with the request
// app.put('/data/:id', async (req, res) => {
//     try {
//         const clientId = req.params.id;
//         const result = await Client.replaceOne({ _id: clientId }, req.body);
//         console.log(result);
//         res.json({ updatedCount: result.modifiedCount });
//     } catch (e) {
//         res.status(500).json({ error: 'something went wrong' });
//     }
// });

// calling and replace whole inner object with the request
app.put('/data/:id', async (req, res) => {
    try {
        const clientId = req.params.id;
        const client = await Client.findOneAndReplace({ _id: clientId }, req.body, { new: true });
        console.log(client);
        res.json({ client });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: 'something went wrong' });
    }
});

// find entry by id and patch (replace) only values of keys which was send in the request
app.patch('/data/:id', async (req, res) => {
    try {
        const clientId = req.params.id;
        const client = await Client.findOneAndUpdate({ _id: clientId }, req.body, { new: true });
        console.log(client);
        res.json({ client });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: 'something went wrong' });
    }
});

// patch/update nested data by its id
app.patch('/data/settings/:id', async (req, res) => {
    console.log(req.params);
    const orderId = req.params.id;
    req.body._id = orderId;
    try {
        const result = await Client.findOneAndUpdate(
            { 'settings._id': orderId },
            { $set: { 'settings.$': req.body } },
            { new: true }
        );
        console.log(result);
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'something went wrong' });
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: 'something went wrong' });
    }
});

// delete entry by id. Only use id because these will be unique
app.delete('data/client/:id', async (req, res) => {
    try {
        const clientId = req.params.id;
        const result = await client.deleteOne({ _id: clientId });
        res.json({ deletedCount: result.deletedCount });
    } catch (e) {
        res.status(500).json({ error: 'something went wrong' });
    }
});

// send and save data to database
app.post('/data', async (req, res) => {
    console.log(req.body);
    const client = new Client(req.body);
    try {
        await client.save();
        res.status(201).json({ customer });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
    // res.send((req.body));
});

const client = new Client({
    name: 'Crowe',
    description: 'beschrijving'
});

// client.save();

app.get('', (req, res) => {
    res.send(client);
});

app.post('', (req, res) => {
    res.send('this is a post request');
});


const start = async () => {
    try {
        await mongoose.connect(CONNECTION);

        app.listen(PORT, () => {
            console.log('App listening on port: ' + PORT);
        });
    } catch (e) {
        console.log(e);
    }
};

start();