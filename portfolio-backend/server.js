const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT || 5001);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';
const FALLBACK_MONGODB_URI = 'mongodb://localhost:27017/portfolio';

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);
app.use(express.json());

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function connectToMongo() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${MONGODB_URI}`);
  } catch (primaryError) {
    if (MONGODB_URI === FALLBACK_MONGODB_URI) {
      throw primaryError;
    }

    console.warn(`Primary MongoDB connection failed: ${primaryError.message}`);
    console.warn(`Trying fallback MongoDB URI: ${FALLBACK_MONGODB_URI}`);
    await mongoose.connect(FALLBACK_MONGODB_URI);
    console.log(`MongoDB connected: ${FALLBACK_MONGODB_URI}`);
  }
}

function createMailTransport() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpService = process.env.SMTP_SERVICE;
  const smtpHost = process.env.SMTP_HOST;

  if (!smtpUser || !smtpPass) {
    return null;
  }

  if (smtpService) {
    return nodemailer.createTransport({
      service: smtpService,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  if (!smtpHost) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

const mailTransport = createMailTransport();
const contactRecipient = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER || '';
const contactSender = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || '';
const emailNotificationsEnabled = Boolean(mailTransport && contactRecipient && contactSender);

if (mailTransport) {
  mailTransport
    .verify()
    .then(() => {
      console.log('SMTP connection verified.');
    })
    .catch((error) => {
      console.warn(`SMTP verification failed: ${error.message}`);
    });
} else {
  console.warn('SMTP is not configured yet. Contact form submissions will only be saved to MongoDB.');
}

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

app.get('/api', (req, res) => {
  res.json({
    message: 'Portfolio Backend API',
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    emailNotifications: emailNotificationsEnabled ? 'configured' : 'not configured',
    endpoints: {
      test: 'GET /api/test',
      contact: 'POST /api/contact',
      contacts: 'GET /api/contacts',
    },
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    emailNotifications: emailNotificationsEnabled,
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/contact', async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const message = req.body.message?.trim();

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in your name, email, and message.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    let emailSent = false;

    if (emailNotificationsEnabled) {
      await mailTransport.sendMail({
        from: `"Portfolio Contact Form" <${contactSender}>`,
        to: contactRecipient,
        replyTo: email,
        subject: `New portfolio message from ${name}`,
        text: [
          'You received a new portfolio contact form message.',
          '',
          `Name: ${name}`,
          `Email: ${email}`,
          '',
          'Message:',
          message,
        ].join('\n'),
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h2 style="margin-bottom: 16px;">New portfolio contact message</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
        `,
      });

      emailSent = true;
    }

    return res.status(201).json({
      success: true,
      emailSent,
      message: emailSent
        ? 'Message sent successfully.'
        : 'Message was saved, but email notifications are not configured yet.',
      data: {
        id: contact._id,
        name,
        email,
        timestamp: contact.date,
      },
    });
  } catch (error) {
    console.error(`Contact submission failed: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while sending your message.',
    });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });

    return res.json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

connectToMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  });
