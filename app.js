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

const PORT = process.env.PORT || 3000;
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

// POST endpoint to add a new client
app.post('/clients', async (req, res) => {
    try {
        const newClientData = req.body;

        // Create a new client instance
        const newClient = new Client(newClientData);

        // Save the new client to the database
        await newClient.save();

        res.status(201).json(newClient); // Respond with the created client and a 201 status code
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// retrieve list of all clients with their id from database
app.get('/clientList', async (req, res) => {
    try {
        const result = await Client.find({}, { clientName: 1 });

        res.send(({ "data": result }));
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});



// POST endpoint to add a scenario to a specific client
app.post('/scenarioAdd/:id', async (req, res) => {
    try {
        const { id: clientId } = req.params;  // Get client ID from URL parameters
        const newScenario = req.body;  // Get new scenario data from request body

        // Find the client by ID and push the new scenario into the scenarios array
        const client = await Client.findByIdAndUpdate(
            clientId,
            { $push: { scenarios: newScenario } },
            { new: true, useFindAndModify: false }
        );

        if (!client) {
            res.status(404).json({ error: 'Client not found' });
        } else {
            res.status(201).json(client.scenarios);  // Respond with the updated scenarios array
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// remove scenario
app.delete('/scenarioRemove/:clientId/:scenarioId', async (req, res) => {
    try {
        const { clientId, scenarioId } = req.params;
        const result = await Client.updateOne(
            { _id: clientId },
            { $pull: { scenarios: { _id: scenarioId } } }
        );
        res.json({ modifiedCount: result.nModified });
    } catch (e) {
        res.status(500).json({ error: 'something went wrong' });
    }
});

// get list of scenarios from client id
app.get('/scenarioList/:id', async (req, res) => {
    console.log({
        requestParams: req.params,
        requestQuery: req.query
    });
    try {
        const { id: clientId } = req.params;
        console.log(clientId);
        const client = await Client.findById(clientId, {
            '_id': 0,  // Exclude the client _id
            'scenarios.scenarioTitle': 1,
            'scenarios.scenarioDescription': 1,
            'scenarios._id': 1
        });
        console.log(client);
        if (!client) {
            res.status(404).json({ error: 'user not found' });
        } else {
            res.json(client.scenarios);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// get settings of specific scenario by its id
// app.get('/scenario/:id', async (req, res) => {
//     console.log({
//         requestParams: req.params,
//         requestQuery: req.query
//     });
//     try {
//         const { id: scenarioId } = req.params;
//         const id = req.params;
//         console.log(scenarioId);
//         // const client = await Client.findById(scenarioId, { 'scenarios.scenarioTitle': 1, 'scenarios.scenarioDescription': 1, 'scenarios._id': 1 });
//         const client = await Client.findOne({'scenarios._id': scenarioId}, {'_id':0,'scenarios.scenarioTitle': 1, 'scenarios.scenarioDescription': 1, 'scenarios.settings': 1,'scenarios._id': 1 });

//         console.log(client);
//         if (!client) {
//             res.status(404).json({ error: 'scenario not found' });
//         } else {
//             res.json({ client });
//         }
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     }
// });

app.get('/scenario/:id', async (req, res) => {
    console.log({
        requestParams: req.params,
        requestQuery: req.query
    });
    try {
        const { id: scenarioId } = req.params;
        console.log(scenarioId);

        const client = await Client.findOne({ 'scenarios._id': scenarioId }, {
            '_id': 0,
            'scenarios': {
                $elemMatch: { _id: scenarioId }
            }
        });

        console.log(client);

        if (!client || !client.scenarios || client.scenarios.length === 0) {
            res.status(404).json({ error: 'scenario not found' });
        } else {
            res.json(client.scenarios[0]);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update a specific scenario
app.put('/scenario/:id', async (req, res) => {
    try {
        const { id: scenarioId } = req.params;
        const newData = req.body;

        const client = await Client.findOneAndUpdate(
            { 'scenarios._id': scenarioId },
            { $set: { 'scenarios.$': newData } },
            { new: true }
        );

        if (!client) {
            return res.status(404).json({ error: 'Scenario not found' });
        }

        res.json(client.scenarios[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



// // finding entry by its id
// app.get('/data/:id', async (req, res) => {
//     console.log({
//         requestParams: req.params,
//         requestQuery: req.query
//     });
//     try {
//         const { id: clientId } = req.params;
//         console.log(clientId);
//         const client = await Client.findById(clientId);
//         console.log(client);
//         if (!client) {
//             res.status(404).json({ error: 'user not found' });
//         } else {
//             res.json({ client });
//         }
//     } catch (e) {
//         res.status(500).json({ error: 'something went wrong' });
//     }
// });

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
            { 'settings._id': orderId }, // get client which has settings object with this id
            { $set: { 'settings.$': req.body } }, // go in settings object and replace $ with req.body
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
        res.status(201).json({ client });
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