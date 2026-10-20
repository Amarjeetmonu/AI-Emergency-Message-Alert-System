# 🚨 AI Emergency Message Alert System

A message urgency classification prototype that categorizes text messages into **Normal, Urgent, and Critical** levels using JavaScript, a Naive Bayes classifier, and configurable emergency phrase rules.

The application includes a web interface, REST API, SQLite message history, dashboard statistics, and browser notifications.

## ✨ Features

* **Message Classification:** Classifies messages into Normal, Urgent, and Critical categories.
* **Naive Bayes Classifier:** Uses labeled training examples to learn message patterns.
* **Emergency Phrase Detection:** Applies configurable rules to recognize selected emergency phrases.
* **REST API:** Provides endpoints for message analysis and history management.
* **SQLite Database:** Stores analyzed messages and their classification results.
* **Dashboard:** Displays message statistics by urgency category.
* **Alert Acknowledgement:** Allows users to acknowledge critical alerts.
* **Browser Notifications:** Supports browser notifications when permissions are granted.
* **Input Validation:** Rejects empty, invalid, and oversized messages.
* **Automated Testing:** Includes classifier tests and API tests.

## 🛠️ Tech Stack

| Technology     | Purpose                                 |
| -------------- | --------------------------------------- |
| JavaScript     | Application logic and classification    |
| Node.js        | JavaScript runtime                      |
| Express.js     | Backend and REST API                    |
| Natural        | Naive Bayes text classification         |
| SQLite         | Message persistence                     |
| HTML           | Frontend structure                      |
| CSS            | Frontend styling                        |
| Git and GitHub | Version control and source code hosting |

## 📁 Project Structure

```text
AI-Emergency-Message-Alert-System/
├── backend/
│   ├── server.js
│   ├── classifier.js
│   ├── classifier.test.js
│   ├── server.test.js
│   ├── evaluation.js
│   ├── database.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .gitignore
└── README.md
```

## ⚙️ Prerequisites

Install the following:

* [Node.js](https://nodejs.org/)
* npm, which is included with Node.js
* Git (optional, for cloning the repository)

No separate Python installation is required.

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Amarjeetmonu/AI-Emergency-Message-Alert-System.git
```

### 2. Navigate to the backend directory

```bash
cd AI-Emergency-Message-Alert-System/backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the application

```bash
npm start
```

### 5. Open the application

Visit:

http://localhost:3000

The backend serves the frontend, so you do not need to open the HTML file through a separate development server.

## 🧪 Testing

### Run classifier tests

```bash
npm test
```

### Run API tests

Start the backend in one terminal:

```bash
npm start
```

Open a second terminal in the backend directory and run:

```bash
npm run test:api
```

### Evaluate the classifier

With the backend directory as the current directory, run:

```bash
node evaluation.js
```

The evaluation script reports a confusion matrix, accuracy, precision, recall, and F1-score for its manually written test examples.

## 🔌 API Endpoints

| Method | Endpoint                        | Description                    |
| ------ | ------------------------------- | ------------------------------ |
| GET    | `/api/health`                   | Checks backend health          |
| POST   | `/analyze`                      | Analyzes and saves a message   |
| GET    | `/api/messages`                 | Retrieves message history      |
| GET    | `/api/stats`                    | Retrieves dashboard statistics |
| PATCH  | `/api/messages/:id/acknowledge` | Acknowledges an alert          |
| DELETE | `/api/messages`                 | Clears message history         |

### Example: Analyze a message

**Request**

```http
POST /analyze
Content-Type: application/json
```

```json
{
  "message": "I cannot breathe"
}
```

**Example response**

```json
{
  "id": 1,
  "message": "I cannot breathe",
  "level": "critical",
  "analysis": "Potential emergency detected. Review this message immediately.",
  "method": "critical-rule",
  "acknowledged": false
}
```

The returned classification method identifies whether a configured rule or the Naive Bayes classifier produced the result.

## 🧠 How Classification Works

The application uses a hybrid classification approach:

1. The incoming message is validated and normalized.
2. Configured critical phrases are checked.
3. Configured urgency patterns are checked.
4. The Naive Bayes classifier predicts a category for other messages.
5. The classification result is returned and stored in SQLite.

The initial model uses curated example messages. It is a prototype, and its predictions are not guaranteed to be correct.

## 🔒 Limitations

* The initial training dataset is small and manually curated.
* Evaluation on manually written examples does not establish real-world accuracy.
* Messages may be incorrectly classified as normal, urgent, or critical.
* Browser notifications depend on browser permissions and application availability.
* The current prototype does not guarantee delivery or detection of emergency alerts.
* It should not replace emergency services or other reliable emergency communication channels.

## 🔮 Future Improvements

* Evaluate the model using a larger, independently labeled dataset.
* Improve critical-message recall and measure false-positive rates.
* Add user authentication and access controls.
* Improve notification reliability.
* Add secure production deployment and monitoring.
* Expand automated testing and model evaluation.

## 👨‍💻 Author

**Amarjeetmonu**

GitHub: [Amarjeetmonu](https://github.com/Amarjeetmonu)

Project Repository: [AI Emergency Message Alert System](https://github.com/Amarjeetmonu/AI-Emergency-Message-Alert-System)
