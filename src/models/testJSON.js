const mongoose = require('mongoose');

const jsonSchema = new mongoose.Schema({
    speakers: [
        {
            name: {
                type: String,
                required: true
            },
            role: {
                type: String,
                required: true
            },
            voice: {
                type: String,
                required: true
            }
        }
    ],

    introduction: [
        {
            speaker: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            },
            mood: {
                type: String,
                required: true
            },
        }
    ],
    briefing: {
        type: String,
        required: true
    },
    characterProfile: {
        name: {
            type: String,
            required: true
        },
        maxAnnoyance: {
            type: Number,
            required: true
        },
        defaultMood: {
            type: String,
            required: true
        },
        annoyedMood: {
            type: String,
            required: true
        },
        maxMood: {
            type: String,
            required: true
        },
        goodFeedbackMood: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        background: {
            type: String,
            required: true
        },
        attitude: {
            type: String,
            required: true
        }
    }
});

module.exports = mongoose.model('TestJSON', jsonSchema);