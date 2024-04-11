const express = require('express');
const mongoose = require('mongoose');
const Client = require('./src/models/client');

const app = express();
mongoose.set('strictQuery', false);

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

app.get('/testJSON', (req, res) => {
    res.send(({ "data": testJSON }));
});
app.post('/testJSON', (req, res) => {
    console.log(req.body);
    res.send((req.body));
});

const client = new Client({
    name: 'Crowe',
    description: 'beschrijving'
});

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