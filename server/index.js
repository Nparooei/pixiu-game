const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// POST endpoint to receive user data
app.post('/user', (req, res) => {
    const { userId, userScore, userToken } = req.body;

    // Log received data to console
    console.log('Received user data:', {
        userId,
        userScore,
        userToken
    });

    // Respond with success message
    res.status(200).json({ message: 'Data received successfully' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});