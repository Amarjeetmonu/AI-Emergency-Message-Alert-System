const test = require("node:test");
const assert = require("node:assert/strict");

const analyzeMessage = require("./classifier");

test("Normal messages should be classified as normal", () => {
    const result = analyzeMessage(
        "Hey, are you free tomorrow?"
    );

    assert.equal(result.level, "normal");
});

test("Urgent messages should be classified as urgent", () => {
    const result = analyzeMessage(
        "Please respond quickly. I need your help."
    );

    assert.equal(result.level, "urgent");
});

test("Breathing emergencies should be classified as critical", () => {
    const result = analyzeMessage(
        "I cannot breathe properly."
    );

    assert.equal(result.level, "critical");
});

test("Threat messages should be classified as critical", () => {
    const result = analyzeMessage(
        "Someone is threatening me."
    );

    assert.equal(result.level, "critical");
});

test("Ordinary homework messages should be classified as normal", () => {
    const result = analyzeMessage(
        "I have completed my homework."
    );

    assert.equal(result.level, "normal");
});

test("Empty messages should not be classified as emergencies", () => {
    const result = analyzeMessage("");

    assert.equal(result.level, "normal");
});