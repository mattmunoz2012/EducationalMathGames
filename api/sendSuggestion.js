import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { name, email, suggestion } = req.body;

  if (!name || !email || !suggestion) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"Mono Games Suggestions" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Game Suggestion from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSuggestion: ${suggestion}`
    });
    res.status(200).json({ message: 'Suggestion sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error: error.toString() });
  }
}
