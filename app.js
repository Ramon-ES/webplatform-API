const express = require('express');
const mongoose = require('mongoose');
const Client = require('./src/models/client');
const cors = require('cors');

// require endpoints
const epSample = require('./src/endpoints/ep-samplejson');

const app = express();
mongoose.set('strictQuery', false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const PORT = process.env.PORT || 443;
const CONNECTION = process.env.CONNECTION;


// post and put is to replace whole object
// patch is to update single property

// simple api, pure js based; hard coded
// app.get('/testJSON', (req, res) => {
//     res.send(({ "data": testJSON }));
// });
// app.post('/testJSON', (req, res) => {
//     console.log(req.body);
//     res.send((req.body));
// });

app.use(epSample);

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

// finding entry by its id
app.get('/data/:id', async (req, res) => {
    console.log({
        requestParams: req.params,
        requestQuery: req.query
    });
    try {
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