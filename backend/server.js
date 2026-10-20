const express = require("express");
const path = require("path");
const analyzeMessage = require("./classifier");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "32kb" }));

// Serve the frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Check whether the backend is running
app.get("/api/health", (req, res) => {
    res.json({
        status: "running",
        message: "Emergency Message AI backend is working."
    });
});

// Analyze and save a message
app.post("/analyze", (req, res) => {
    const message = req.body?.message;

    if (typeof message !== "string") {
        return res.status(400).json({
            error: "Message must be a string."
        });
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length === 0) {
        return res.status(400).json({
            error: "Message cannot be empty."
        });
    }

    if (trimmedMessage.length > 5000) {
        return res.status(413).json({
            error: "Message cannot exceed 5000 characters."
        });
    }

    try {
        const result = analyzeMessage(trimmedMessage);

        const insert = db.prepare(`
            INSERT INTO messages (message, level, analysis)
            VALUES (?, ?, ?)
        `);

        const saved = insert.run(
            trimmedMessage,
            result.level,
            result.message
        );

        return res.json({
            id: Number(saved.lastInsertRowid),
            message: trimmedMessage,
            level: result.level,
            analysis: result.message,
            method: result.method,
            acknowledged: false
        });
    } catch (error) {
        console.error("Message analysis/save error:", error);

        return res.status(500).json({
            error: "Could not analyze or save the message."
        });
    }
});
// Retrieve message history
app.get("/api/messages", (req, res) => {
    try {
        const messages = db.prepare(`
            SELECT
                id,
                message,
                level,
                analysis,
                acknowledged,
                created_at
            FROM messages
            ORDER BY id DESC
        `).all();

        res.json(
            messages.map(item => ({
                ...item,
                acknowledged: Boolean(item.acknowledged)
            }))
        );
    } catch (error) {
        console.error("History error:", error);

        res.status(500).json({
            error: "Could not retrieve message history."
        });
    }
});

// Dashboard statistics
app.get("/api/stats", (req, res) => {
    try {
        const stats = db.prepare(`
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN level = 'normal' THEN 1 ELSE 0 END) AS normal,
                SUM(CASE WHEN level = 'urgent' THEN 1 ELSE 0 END) AS urgent,
                SUM(CASE WHEN level = 'critical' THEN 1 ELSE 0 END) AS critical,
                SUM(
                    CASE
                        WHEN level = 'critical' AND acknowledged = 0
                        THEN 1
                        ELSE 0
                    END
                ) AS pendingCritical,
                SUM(
                    CASE
                        WHEN level = 'critical' AND acknowledged = 1
                        THEN 1
                        ELSE 0
                    END
                ) AS acknowledgedCritical
            FROM messages
        `).get();

        res.json({
            total: stats.total || 0,
            normal: stats.normal || 0,
            urgent: stats.urgent || 0,
            critical: stats.critical || 0,
            pendingCritical: stats.pendingCritical || 0,
            acknowledgedCritical: stats.acknowledgedCritical || 0
        });
    } catch (error) {
        console.error("Dashboard statistics error:", error);

        res.status(500).json({
            error: "Could not load dashboard statistics."
        });
    }
});

// Acknowledge an alert
app.patch("/api/messages/:id/acknowledge", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "Invalid message ID."
        });
    }

    try {
        const result = db.prepare(`
            UPDATE messages
            SET acknowledged = 1
            WHERE id = ?
        `).run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Message not found."
            });
        }

        res.json({
            success: true,
            message: "Alert acknowledged."
        });
    } catch (error) {
        console.error("Acknowledgement error:", error);

        res.status(500).json({
            error: "Could not acknowledge the alert."
        });
    }
});

// Clear message history
app.delete("/api/messages", (req, res) => {
    try {
        db.prepare("DELETE FROM messages").run();

        res.json({
            success: true,
            message: "Message history cleared."
        });
    } catch (error) {
        console.error("History deletion error:", error);

        res.status(500).json({
            error: "Could not clear message history."
        });
    }
});

app.listen(PORT, () => {
    console.log(`App running at http://localhost:${PORT}`);
});