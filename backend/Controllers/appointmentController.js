const Appointment = require('../Models/Appointment');
const { sendConfirmationEmail, sendRescheduleEmail } = require('../utils/mailer');

// Controller to book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { a_name, a_email, a_service, a_date, a_outlet, a_timeslot, a_specialrequest, local_email, total_price, booking_price } = req.body;

    // Check if there are already 3 appointments for the same date, time slot, outlet, and local email
    const appointmentCount = await Appointment.countDocuments({
      a_date: new Date(a_date),
      a_timeslot: a_timeslot,
      a_outlet: a_outlet,
    });

    if (appointmentCount >= 3) {
      return res.status(400).json({ message: 'Maximum appointment limit reached for this Time slot, Date. Please choose another Time or Date.' });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      a_name,
      a_email,
      a_service,
      a_date,
      a_outlet,
      a_timeslot,
      a_specialrequest,
      local_email,
      total_price,     // Include total price
      booking_price,   // Include booking price
    });

    // Save to database
    await newAppointment.save();

    // Send confirmation email
    sendConfirmationEmail(a_email, newAppointment);

    res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error });
  }
};

// Controller to get appointments by email
const getAppointmentsByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const appointments = await Appointment.find({ local_email: email });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments', error });
  }
};

// Controller to reschedule an appointment
const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { a_date, a_timeslot, a_outlet } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      {
        a_date: new Date(a_date),
        a_timeslot: a_timeslot,
        a_outlet: a_outlet || undefined,
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    sendRescheduleEmail(updatedAppointment.a_email, updatedAppointment);

    res.status(200).json({ message: 'Appointment rescheduled successfully', appointment: updatedAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Error rescheduling appointment', error });
  }
};

// Controller to cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling appointment', error });
  }
};

module.exports = {
  bookAppointment,
  getAppointmentsByEmail,
  rescheduleAppointment,
  cancelAppointment,
};
