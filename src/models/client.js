const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    clients: [
        {
            clientName: {
                type: String,
                required: true
            },
            scenarios: [
                {
                    scenarioTitle: {
                        type: String,
                        required: true
                    },
                    scenarioDescription: {
                        type: String,
                        required: true
                    },
                    settings: {
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
                        targetProfile: {
                            name: {
                                type: String,
                                required: true
                            },
                            characterType: {
                                type: String,
                                required: true
                            },
                            role: {
                                type: String,
                                required: true
                            },
                            age: {
                                type: Number,
                                required: true
                            },
                            yearsExperience: {
                                type: Number,
                                required: true
                            },
                            primaryBehaviour: {
                                type: String,
                                required: true
                            },
                            challenges: {
                                type: String,
                                required: true
                            },
                            strengths: {
                                type: String,
                                required: true
                            },
                            stressReaction: {
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
                            }
                        },
                        conversationContext: {
                            companyContext: {
                                type: String,
                                required: true
                            },
                            meetingContext: {
                                type: String,
                                required: true
                            }
                        },
                        feedbackContext: {
                            targetFeedback: {
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
                            }
                        },
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
                        ]
                    }
                }
            ]
        }
    ]

});

module.exports = mongoose.model('Client', clientSchema);