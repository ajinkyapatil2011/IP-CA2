const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const AppointmentRouter = require('./Routes/appointmentRoutes'); // Import appointment routes


require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/appointments', AppointmentRouter);
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Add this route to handle payment order creation
app.post('/payment/createOrder', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency,
      receipt: crypto.randomBytes(10).toString('hex'), // Unique receipt id
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).send('Error creating payment order');
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});
