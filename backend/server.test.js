const test = require("node:test");
const assert = require("node:assert/strict");

const BASE_URL = "http://localhost:3000";

test("Health endpoint returns running status", async () => {
    const response = await fetch(`${BASE_URL}/api/health`);

    assert.equal(response.status, 200);

    const data = await response.json();

    assert.equal(data.status, "running");
});

test("Analyze endpoint rejects an empty message", async () => {
    const response = await fetch(`${BASE_URL}/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "   "
        })
    });

    assert.equal(response.status, 400);

    const data = await response.json();

    assert.ok(data.error);
});

test("Analyze endpoint rejects a non-string message", async () => {
    const response = await fetch(`${BASE_URL}/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: 12345
        })
    });

    assert.equal(response.status, 400);
});

test("Analyze endpoint rejects messages over 5000 characters", async () => {
    const response = await fetch(`${BASE_URL}/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "a".repeat(5001)
        })
    });

    assert.equal(response.status, 413);
});

test("Analyze endpoint returns a valid classification", async () => {
    const response = await fetch(`${BASE_URL}/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "I cannot breathe"
        })
    });

    assert.equal(response.status, 200);

    const data = await response.json();

    assert.equal(data.level, "critical");
    assert.equal(data.method, "critical-rule");
    assert.ok(Number.isInteger(data.id));
    assert.ok(data.id > 0);
});