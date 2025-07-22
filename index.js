// index.js (or index.cjs)
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); 

// Path to service account key JSON
const serviceAccount = require('./firebase-service-account.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
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
    message.imageUrl = img;
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

app.use('*', (req, res) => {
  res.status(404).json({ error: 'الصفحة غير موجودة' });
});

module.exports = app;