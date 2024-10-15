const Appointment = require('../Models/Appointment');

// Middleware to check appointment limit for the same date and time slot
const checkAppointmentLimit = async (req, res, next) => {
  try {
    const { a_date, a_timeslot, a_outlet, local_email } = req.body;

    if (!a_date || !a_timeslot || !a_outlet || !local_email) {
      return res.status(400).json({ message: 'Date, Time Slot, Outlet, and Local Email are required for appointment booking.' });
    }

    const appointmentCount = await Appointment.countDocuments({
      a_date: new Date(a_date),
      a_timeslot: a_timeslot,
      a_outlet: a_outlet,
    });

    if (appointmentCount >= 3) {
      return res.status(400).json({ message: 'Maximum appointment limit reached for this Time slot, Date. Please choose another Time or Date.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking appointment limit', error });
  }
};

module.exports = checkAppointmentLimit;
