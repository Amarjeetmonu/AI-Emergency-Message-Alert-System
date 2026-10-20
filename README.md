# AI Emergency Message Alert System

A full-stack message urgency classification prototype that categorizes
messages into Normal, Urgent, and Critical levels.

## Live Demo

https://ai-emergency-message-alert-system.onrender.com

## Features

- Message classification into three urgency levels
- JavaScript Naive Bayes classifier
- Configurable emergency phrase detection
- Express.js REST API
- SQLite message history
- Dashboard statistics
- Critical alert acknowledgement
- Browser notifications
- Input validation
- Automated tests
- Model evaluation script

## Tech Stack

- JavaScript
- Node.js
- Express.js
- Natural (Naive Bayes)
- SQLite
- HTML
- CSS

## Run Locally

Clone the repository:

    git clone https://github.com/Amarjeetmonu/AI-Emergency-Message-Alert-System.git

Move to the backend directory:

    cd AI-Emergency-Message-Alert-System/backend

Install dependencies:

    npm install

Start the server:

    npm start

Open:

    http://localhost:3000

## Testing

Run classifier tests:

    npm test

Run API tests while the server is running:

    npm run test:api

Run the evaluation script:

    node evaluation.js

## Limitations

- The classifier uses a limited set of curated training examples.
- Evaluation on manually written examples does not establish real-world performance.
- False positives and false negatives are possible.
- Browser notifications depend on browser permissions and application availability.
- This prototype is not a replacement for emergency services.

## Future Improvements

- Evaluate on a larger, independently labeled dataset.
- Improve critical-message recall.
- Add user authentication and authorization.
- Improve notification reliability.
- Add more comprehensive automated tests.
