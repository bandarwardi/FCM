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
  credential: admin.credential.cert({
  "type": "service_account",
  "project_id": "hala-sd",
  "private_key_id": "f9406ebf174378274f84f9caeb2a73a0ddaca662",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC/jCJSiWn0wH0/\nO4HYePhJK9WdE6leHXPS0YViEJ2NgMpEIJurNpmUb2kUVfFZbQBShzNrTdMdb9KB\n5VMR/U9SURVb5y0VMKTMwJBeiLTU3WqKJCvpZZc6+2+/TzZ6dPephUu0YIboZs2I\n81HlqeloV9eJHtiOxGHuRdgcWOIFXkJoZNuClIt+HNVE+QpHBRvz8Hb9Jbrti65Z\nV5HSLjuV+fwc9HcNxGXXt8TJXNwodEw+kTFYi4CB7+LNeXi+qqnuVNuRT9ogDJTm\nQwSu6qSSHJ418N+F97yFmF1zvvaeJczkLuWwLmbxQrpkBdigXsdBoSk/kRqW2X4g\nPCidPrpXAgMBAAECggEAQmDWmBGklTuLa7k8cv7g08KMASYKIGJGe/09otEtOBc0\ngM1oBLokGKtPF8v8mkfKv864g+vxSBczNO56jhZhQZ51r2Z6WgiEY6wrm4b2W3nr\nbLnCOdyJvtfZTsutjlwwYx+dL4Hv3mOZwGbJr7Pk/dLLD2qQE1F8umybyp8GnGMH\nTZzchehlFz3GC1ClJNMDC16oQnYU3ZmOh1s14WrfuPFlUmapSO9O4Dh0UUbHRndn\n7GYxzpWZp7l5MtpSghtSePArNyQx9+5ZeRh6fMSSnZIGZqJL6myGyEiHpTREEZg0\n57cMnMv0I3gHdptPrHKsZOUHy6yhnkQG6OF7PH5F4QKBgQDinskORasvYdCoUeBm\nEY/L8GIMcKPbC0Ux10oTN33XtJrVF0LNfOwGwtVsHNfJ02iUkvYOv6wl9g+pFdww\nerwwf+sTkzQOWwnvZtXrhBxjylaXEkbWb0IvhmmzK69hI/CFeNibLIs4oZ58G4aM\n7ow/lXKzukO7Mibz3Rp4d2+kMQKBgQDYYVQtbNR+xri2DQDDE+ZIYN6wVTmpd0at\nMW0xFyWPz0dXw9TbeMiuzY/ilznNQRND7lASdUJo8sy5w6iJ/OteNNEk9g5ByWch\n5w/n0Lf2vmkXCWo6uQiFrA767MT1r6J3RSXXC3tnCeY99d0+x4/yl9G/8Tda39lK\nnwRhHpbNBwKBgDHmowEYiDRbxpV5yf7PuSlAGmcA2qPeHHN4I6CNpJE9/KYVhCk5\na8OlXVd8FmwjuDCXF8VxoVeOki46WQz3yb6oPDxIOrs6grqLm2lL4vB6WozTgnOv\ndhR+9YF1ih3KyyiozpGEwndK51oOuZcI5CsQHnzC9C0hQwCJ3E1Qh23RAoGAAust\nK3+wThV4IFyEih0WmhtUZaSAppyJQ4TLKEJbq1jsaW6mzF8Qtern6fKIQRCDpgLs\n6ZLTVn8P6+GLwHC87ARiXdFD1/dTgM2RFVtnX9ipqjniSPB+AO+VNCVFctrvohQ4\nsnHhND6Z8HQEi/g9JNSPa7thN8SVNcB3WqgC+LkCgYBejgjveYEf8uCFAxKpNlsx\n2Shz93pSKLLtAzyrcE16WkpID+f0gWRfG00kHG0JA7ak8LUGrcOcE+QimSkGOm8M\ny3DdEp8JhdZ0/zO28h2OzZbNzbMT+lXKlJT3WJvmuyUtjSj0jpMrTYDxKPpv3UrT\ntoyiEaIbP9S30R9ivQF5DQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@hala-sd.iam.gserviceaccount.com",
  "client_id": "100672264719992762524",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40hala-sd.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
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


// Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

module.exports = app;