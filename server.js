import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*", // Add your deployed frontend URL
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate inputs
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: 'akaravindkumar67@gmail.com',
      subject: `New Inquiry from Portfolio Website`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 30px;">
          <div style="max-width: 600px; background-color: #ffffff; padding: 25px; border-radius: 8px; margin: auto; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
            <h2 style="color: #4F46E5;">Hi BATTU ARAVIND KUMAR,</h2>
            <p>You've received a new inquiry through your portfolio website.<br>Here are the details:</p>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
            
            <p>👤 <strong>Full Name:</strong> ${name}</p>
            <p>📧 <strong>Email Address:</strong> ${email}</p>
            <p>💬 <strong>Message:</strong><br>"${message}"</p>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
            
            <p>This could be a great opportunity. Consider replying soon!</p>
            <p style="margin-top: 30px;">Warm regards,<br><strong>Your Portfolio Assistant ✨</strong></p>
            
            <small style="display: block; margin-top: 30px; color: #9ca3af;">
              🔒 This is an automated notification securely sent from your personal portfolio site.
            </small>
          </div>
        </div>
      `
    };
    

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully from:', email);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export the Express API
export default app; 