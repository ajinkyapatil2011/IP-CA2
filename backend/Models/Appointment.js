const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  a_name: {
    type: String,
    required: true,
  },
  a_email: {
    type: String,
    required: true,
  },
  a_service: {
    type: [String], // Changed to an array of strings to allow multiple services
    required: true,
  },
  a_date: {
    type: Date,
    required: true,
  },
  a_outlet: {
    type: String,
    required: true,
  },
  a_timeslot: {
    type: String,
    required: true,
  },
  a_specialrequest: {
    type: String,
  },
  local_email: {
    type: String,
    required: true, // Marked as required
  },
  total_price: { // New field for total price of the services
    type: Number,
    required: true,
  },
  booking_price: { // New field for additional booking price (if applicable)
    type: Number,
    required: true,
  }
});

const AppointmentModel = mongoose.model('Appointment', appointmentSchema);

module.exports = AppointmentModel;