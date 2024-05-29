const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    scenarioTitle: {
        type: String,
        required: true
    },
    scenarioDescription: {
        type: String,
        required: true
    },
    settings: {
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
        },
        briefing: {
            type: String,
            required: true
        },
        companyContext: {
            type: String,
            required: true
        },
        meetingContext: {
            type: String,
            required: true
        },
        targetPerspective: {
            type: String,
            required: true
        },
        fourGBehaviour: {
            type: String,
            required: true
        },
        fourGFeeling: {
            type: String,
            required: true
        },
        fourGConsequence: {
            type: String,
            required: true
        },
        fourGDesired: {
            type: String,
            required: true
        },
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
                target: {
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
                }
            }
        ],



    }
});

module.exports = mongoose.model('Client', clientSchema);