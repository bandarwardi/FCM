// index.js (or index.cjs)
require("dotenv").config();
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); 

// Path to service account key JSON
// const serviceAccount = require('./firebase-service-account.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: "googleapis.com"
  })
});

app.get('/', (req, res) => {
  res.send('🎉 مرحبًا بك في واجهة الإشعارات - FCM');
});

// === API endpoint to subscribe a token to a topic ===
app.post('/subscribe', async (req, res) => {
  const { token, topic } = req.body;

  if (!token || !topic) {
    return res.status(400).json({ error: 'Missing token or topic' });
  }

  try {
    const response = await admin.messaging().subscribeToTopic([token], topic);
    res.json({ success: true, response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// === API endpoint to send notification to a topic ===
app.post('/send', async (req, res) => {
  const { token, topic, title, body, img } = req.body;

  if (!title || !body || (!token && !topic)) {
    return res.status(400).json({
      error: 'Missing title, body, and either token or topic is required',
    });
  }

  const message = {
    notification: { title, body },
  };

  if(img){
    message.notification.imageUrl = img;
  }

  if (token) {
    message.token = token;
  } 
  else {
    message.topic = topic;
  }

  try {
    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});


// Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

module.exports = app;