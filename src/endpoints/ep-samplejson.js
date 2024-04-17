// first simple api for 29 april deadline

const router = require('express').Router();
const TestJSON = require('../models/testJSON');

// store sampleJSON
const sampleJSON = {
    "speakers": [
        { "name": "Sara", "role": "leader", "voice": "voicemodel-female" },
        { "name": "David", "role": "target", "voice": "voicemodel-male" },
        { "name": "James", "role": "support", "voice": "voicemodel-male" }
    ],
    "introduction": [
        { "speaker": "Sarah", "text": "Hoi allen, wat is de status?", "mood": "None" },
        { "speaker": "David", "text": "Alles gaat fout, ik trek het niet meer", "mood": "Sadness" },
        { "speaker": "Sarah", "text": "Dat is jammer om te horen David, maar je moet gewoon door.", "mood": "Rage" },
    ],
    "briefing": "David is overspannen en krijgt zijn werk niet af. Jij gaat hem feedback geven om samen op een oplossing te komen.",
    "characterProfile": {
        "name": "David",
        "maxAnnoyance": 5,
        "defaultMood": "Indignation",
        "annoyedMood": "Aversion",
        "maxMood": "Revulsion",
        "goodFeedbackMood": "Amusement",
        "role": "Accountant responsible for creating weekly reports detailing the cash-flow of the company.",
        "background": "David comes from a small family, he is broke and desperate to work. Lately he's struggled with meeting quota's as his newborn isn't allowing him to get a single night's rest. ",
        "attitude": "David tends to be stressed, he is not open to feedback and prefers to keep to himself. He avoids the truth of the situation."
    }
};

router.get('/testJSON', async (req, res) => {
    try {
        const result = await TestJSON.find();
        res.send(result[0]);
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

// send and save data to database full reset
router.post('/testJSON/reset', async (req, res) => {
    // delete collection
    TestJSON.collection.drop();

    // create new collection and store sample json in it
    const testjson = new TestJSON(sampleJSON);
    try {
        const result = await testjson.save();
        // res.send((req.body));
        res.status(201).json(result);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// calling and replace whole inner object with the request
router.put('/testJSON/replace/:id', async (req, res) => {
    try {
        const objectID = req.params.id;
        const newObject = await TestJSON.findOneAndReplace({ _id: objectID }, req.body, { new: true });
        console.log(newObject);
        res.json(newObject);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: 'something went wrong' });
    }
});

module.exports = router;