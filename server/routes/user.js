// routes/user.js
const express = require('express');
const router = express.Router();

// POST route to accept userId, userToken, and userScore
router.post('/user', (req, res) => {
  const { userId, userToken, userScore } = req.body;

  // Validate input
  if (!userId || !userToken || userScore === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Process the data as needed
  // For now, we simply log it and send a success response
  console.log(`UserId: ${userId}, UserToken: ${userToken}, UserScore: ${userScore}`);

  res.status(200).json({ message: 'User data received successfully' });
});

module.exports = router;
