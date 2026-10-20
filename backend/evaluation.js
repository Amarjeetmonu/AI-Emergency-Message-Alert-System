
const analyzeMessage = require("./classifier");

const testData = [
    { message: "Can we meet for lunch tomorrow?", expected: "normal" },
    { message: "Please send me the lecture notes.", expected: "normal" },
    { message: "I will finish the assignment tonight.", expected: "normal" },
    { message: "The bus is arriving in ten minutes.", expected: "normal" },
    { message: "Thanks for sharing the document.", expected: "normal" },
    { message: "What time does the library close?", expected: "normal" },
    { message: "Please call me immediately.", expected: "urgent" },
    { message: "I need your help right now.", expected: "urgent" },
    { message: "This issue needs urgent attention.", expected: "urgent" },
    { message: "Please reply as soon as possible.", expected: "urgent" },
    { message: "Can you contact me right away?", expected: "urgent" },
    { message: "We need to discuss this immediately.", expected: "urgent" },
    { message: "I cannot breathe properly.", expected: "critical" },
    { message: "Call an ambulance right now.", expected: "critical" },
    { message: "Someone is threatening me.", expected: "critical" },
    { message: "I am being attacked.", expected: "critical" },
    { message: "I have severe chest pain.", expected: "critical" },
    { message: "Someone has lost consciousness.", expected: "critical" },
    { message: "There is a fire in the building.", expected: "critical" },
    { message: "I am trapped and need rescue.", expected: "critical" },
    { message: "I completed my project yesterday.", expected: "normal" },
    { message: "Could you explain this topic later?", expected: "normal" },
    { message: "Please review this without delay.", expected: "urgent" },
    { message: "Someone needs immediate rescue.", expected: "critical" }
];

const labels = ["normal", "urgent", "critical"];
const matrix = {};

for (const actual of labels) {
    matrix[actual] = {};
    for (const predicted of labels) {
        matrix[actual][predicted] = 0;
    }
}

let correct = 0;

for (const item of testData) {
    const result = analyzeMessage(item.message);
    const predicted = result.level;

    matrix[item.expected][predicted]++;

    if (predicted === item.expected) {
        correct++;
    } else {
        console.log(
            `MISCLASSIFIED: "${item.message}"`,
            `Expected=${item.expected}, Predicted=${predicted}`
        );
    }
}

console.log("\nConfusion Matrix");
console.log("Rows = actual labels; columns = predicted labels");
console.table(matrix);

console.log(
    `Accuracy: ${(correct / testData.length * 100).toFixed(2)}%`
);

console.log("\nPer-class metrics");

for (const label of labels) {
    const tp = matrix[label][label];

    const fp = labels.reduce(
        (sum, actual) =>
            sum + (actual === label ? 0 : matrix[actual][label]),
        0
    );

    const fn = labels.reduce(
        (sum, predicted) =>
            sum + (predicted === label ? 0 : matrix[label][predicted]),
        0
    );

    const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
    const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
    const f1 = precision + recall === 0
        ? 0
        : 2 * precision * recall / (precision + recall);

    console.log(
        `${label}: Precision=${precision.toFixed(2)}, ` +
        `Recall=${recall.toFixed(2)}, F1=${f1.toFixed(2)}`
    );
}

console.log(
    `\nEvaluated ${testData.length} hand-written test examples.`
);