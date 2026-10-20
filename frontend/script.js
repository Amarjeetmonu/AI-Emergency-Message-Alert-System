const messageInput = document.getElementById("message");
const analyzeButton = document.getElementById("analyzeBtn");
const result = document.getElementById("result");
const acknowledgeButton = document.getElementById("acknowledgeBtn");
const historyList = document.getElementById("historyList");
const clearHistoryButton = document.getElementById("clearHistoryBtn");

let currentAlertId = null;

// Retrieve history from the backend
async function getHistory() {
    const response = await fetch("/api/messages");

    if (!response.ok) {
        throw new Error("Could not load message history.");
    }

    return response.json();
}

// Display history
async function renderHistory() {
    try {
        const history = await getHistory();

        historyList.replaceChildren();

        history.forEach(item => {
            const li = document.createElement("li");

            const date = new Date(
                item.created_at.replace(" ", "T") + "Z"
            );

            li.textContent =
                item.level.toUpperCase() + " — " +
                item.message + "\n" +
                "Time: " + date.toLocaleString() + "\n" +
                "Status: " +
                (item.acknowledged ? "Acknowledged" : "Not acknowledged");

            historyList.appendChild(li);
        });
    } catch (error) {
        console.error(error);

        historyList.textContent =
            "Could not load history. Please check the backend.";
    }
}

// Analyze a message
analyzeButton.addEventListener("click", async function () {
    const message = messageInput.value.trim();

    if (!message) {
        result.textContent = "Please enter a message first.";
        result.className = "result";
        return;
    }

    // Request browser notification permission when needed
    if (
        "Notification" in window &&
        Notification.permission === "default"
    ) {
        await Notification.requestPermission();
    }

    analyzeButton.disabled = true;
    acknowledgeButton.hidden = true;
    currentAlertId = null;

    result.className = "result";
    result.textContent = "Analyzing message...";

    try {
        const response = await fetch("/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Analysis failed.");
        }

        currentAlertId =
            data.level === "critical" ? data.id : null;

        result.className = "result";

        if (data.level === "critical") {
            result.classList.add("critical");
        } else if (data.level === "urgent") {
            result.classList.add("urgent");
        }

        result.textContent =
            "Priority: " + data.level.toUpperCase() +
            "\n" + data.analysis;

        acknowledgeButton.hidden = currentAlertId === null;

        // Notify the user about critical messages
        if (
            data.level === "critical" &&
            "Notification" in window &&
            Notification.permission === "granted"
        ) {
            new Notification("Critical Message Detected!", {
                body: data.message,
                tag: "emergency-message-" + data.id
            });
        }

        await renderHistory();
    } catch (error) {
        console.error(error);

        result.className = "result";
        result.textContent =
            "Could not analyze or save the message. " +
            "Check the backend and try again.";
    } finally {
        analyzeButton.disabled = false;
    }
});

// Acknowledge a critical alert
acknowledgeButton.addEventListener("click", async function () {
    if (currentAlertId === null) {
        return;
    }

    acknowledgeButton.disabled = true;

    try {
        const response = await fetch(
            `/api/messages/${currentAlertId}/acknowledge`,
            {
                method: "PATCH"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Acknowledgement failed.");
        }

        result.textContent =
            "Alert acknowledged. Please review the message " +
            "and take appropriate action.";

        acknowledgeButton.hidden = true;
        currentAlertId = null;

        await renderHistory();
    } catch (error) {
        console.error(error);

        result.textContent =
            "Could not acknowledge the alert. Please try again.";
    } finally {
        acknowledgeButton.disabled = false;
    }
});

// Clear database history
clearHistoryButton.addEventListener("click", async function () {
    const confirmed = confirm(
        "Are you sure you want to permanently clear message history?"
    );

    if (!confirmed) {
        return;
    }

    clearHistoryButton.disabled = true;

    try {
        const response = await fetch("/api/messages", {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Could not clear history.");
        }

        currentAlertId = null;
        acknowledgeButton.hidden = true;

        result.textContent = "Message history cleared.";

        await renderHistory();
    } catch (error) {
        console.error(error);

        result.textContent = "Could not clear message history.";
    } finally {
        clearHistoryButton.disabled = false;
    }
});

// Load saved messages when the page opens
renderHistory();

// Dashboard elements
const totalCount = document.getElementById("totalCount");
const normalCount = document.getElementById("normalCount");
const urgentCount = document.getElementById("urgentCount");
const criticalCount = document.getElementById("criticalCount");
const pendingCount = document.getElementById("pendingCount");
const acknowledgedCount = document.getElementById("acknowledgedCount");

const refreshStatsBtn = document.getElementById("refreshStatsBtn");
const statsStatus = document.getElementById("statsStatus");

// Load dashboard statistics from the backend
async function loadDashboardStats() {
    refreshStatsBtn.disabled = true;
    statsStatus.textContent = "Loading statistics...";

    try {
        const response = await fetch("/api/stats");
        const stats = await response.json();

        if (!response.ok) {
            throw new Error(
                stats.error || "Could not load statistics."
            );
        }

        totalCount.textContent = stats.total;
        normalCount.textContent = stats.normal;
        urgentCount.textContent = stats.urgent;
        criticalCount.textContent = stats.critical;
        pendingCount.textContent = stats.pendingCritical;
        acknowledgedCount.textContent =
            stats.acknowledgedCritical;

        statsStatus.textContent = "Statistics updated successfully.";
    } catch (error) {
        console.error(error);
        statsStatus.textContent =
            "Could not load statistics. Check the backend.";
    } finally {
        refreshStatsBtn.disabled = false;
    }
}

// Refresh statistics manually
refreshStatsBtn.addEventListener(
    "click",
    loadDashboardStats
);

// Refresh after analyzing, acknowledging, or clearing messages
const originalRenderHistory = renderHistory;

renderHistory = async function () {
    await originalRenderHistory();
    await loadDashboardStats();
};

// Initial dashboard load
loadDashboardStats();