const natural = require("natural");

const classifier = new natural.BayesClassifier();

// Training dataset: message aur uska label.
// Ye initial curated examples hain, production dataset nahi.
const trainingData = {
    normal: [
        "Hey are you free tomorrow",
        "I will call you in the evening",
        "Please send me the notes",
        "I have completed my homework",
        "What time is the meeting",
        "Can we talk about the project",
        "I am going to college",
        "Please check your email",
        "Let us meet next week",
        "I will send the document later",
        "How was your day",
        "Thank you for your help yesterday",
        "I need the assignment details",
        "The class starts at ten",
        "Please share the photograph",
        "I am travelling home",
        "We can discuss this tomorrow",
        "Did you finish the report",
        "I will message you after lunch",
        "Please remind me about the meeting",
        "Can you share the location",
        "I bought groceries today",
        "The train arrives in one hour",
        "I am studying for my exam",
        "Let us plan the weekend"
    ],

    urgent: [
        "Please respond quickly",
        "I need your help right now",
        "Please call me immediately",
        "This is urgent",
        "Please reply as soon as possible",
        "I need to speak with you soon",
        "Please check this message urgently",
        "Call me when you see this",
        "I need your assistance today",
        "Please do not delay your response",
        "This matter needs quick attention",
        "Can you contact me right away",
        "Please help me resolve this soon",
        "I am waiting for your urgent response",
        "We need to discuss this immediately",
        "Please get back to me quickly",
        "I need an answer today",
        "This issue cannot wait long",
        "Please contact me as soon as possible",
        "I need your support urgently",
        "Please review this right away",
        "Can you come here soon",
        "Please respond without delay",
        "I need to talk to you now",
        "Please handle this as a priority"
    ],

    critical: [
        "I cannot breathe",
        "I can't breathe properly",
        "I have severe chest pain",
        "Call an ambulance",
        "This is a medical emergency",
        "I am in danger",
        "Help me now",
        "Someone is threatening me",
        "I am being attacked",
        "I need emergency help",
        "Someone is badly injured",
        "I am having difficulty breathing",
        "There is a fire in the building",
        "Someone has lost consciousness",
        "I am trapped and need rescue",
        "I have serious bleeding",
        "Someone is threatening to hurt me",
        "I need urgent medical attention",
        "I am having a severe allergic reaction",
        "A person is unconscious",
        "I think someone is having a heart attack",
        "There has been a serious accident",
        "I am trapped inside a burning building",
        "Please send emergency medical help",
        "Someone needs immediate rescue"
    ]
};

// Train the model from the labeled examples.
for (const [label, messages] of Object.entries(trainingData)) {
    for (const message of messages) {
        classifier.addDocument(message, label);
    }
}

classifier.train();

// Safety-oriented phrase matching.
// These rules supplement the ML model for known emergency phrases.
const criticalPatterns = [
    /\bi (?:can't|cannot|can not) breathe\b/,
    /\bsevere chest pain\b/,
    /\bchest pain\b/,
    /\bcall (?:an )?ambulance\b/,
    /\bmedical emergency\b/,
    /\bi am in danger\b/,
    /\bhelp me now\b/,
    /\bsomeone is threatening me\b/,
    /\bi am being attacked\b/,
    /\bi need emergency help\b/,
    /\bdifficulty breathing\b/,
    /\bserious bleeding\b/,
    /\blost consciousness\b/,
    /\bunconscious\b/,
    /\bheart attack\b/,
    /\bserious accident\b/,
    /\bburning building\b/,
    /\bimmediate rescue\b/
];

const urgentPatterns = [
    /\burgent\b/,
    /\bimportant\b/,
    /\bplease call me\b/,
    /\bcall me immediately\b/,
    /\bi need help\b/,
    /\bneed your help right now\b/,
    /\bplease respond quickly\b/,
    /\bcall me as soon as possible\b/
];

function analyzeMessage(message) {
    if (typeof message !== "string") {
        throw new TypeError("Message must be a string.");
    }

    const text = message
        .toLowerCase()
        .replace(/[^\w\s']/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (!text) {
        return {
            level: "normal",
            message: "No message content to analyze.",
            method: "validation"
        };
    }

    // First check for configured critical phrases.
    if (criticalPatterns.some(pattern => pattern.test(text))) {
        return {
            level: "critical",
            message:
                "Potential emergency detected. Review this message immediately.",
            method: "critical-rule"
        };
    }

    // Keep explicit urgency signals easy to recognize.
    if (urgentPatterns.some(pattern => pattern.test(text))) {
        return {
            level: "urgent",
            message: "This message may need prompt attention.",
            method: "urgency-rule"
        };
    }

    // Use the trained ML classifier for other messages.
    const prediction = classifier.classify(text);

    if (prediction === "critical") {
        return {
            level: "critical",
            message:
                "The trained model flagged this message as potentially critical. Review it immediately.",
            method: "naive-bayes"
        };
    }

    if (prediction === "urgent") {
        return {
            level: "urgent",
            message: "The trained model flagged this message for prompt attention.",
            method: "naive-bayes"
        };
    }

    return {
        level: "normal",
        message: "The trained model classified this message as normal.",
        method: "naive-bayes"
    };
}

module.exports = analyzeMessage;