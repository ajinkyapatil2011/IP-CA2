const postmark = require('postmark');

// Create Postmark client
const client = new postmark.ServerClient('b181ae3b-fadc-479b-bd0a-9f621cdb5549');

// Send confirmation email
const sendConfirmationEmail = (recipient, appointmentDetails) => {
  client.sendEmail({
    From: '2022.yash.rahate@ves.ac.in',
    To: recipient,
    Subject: 'Appointment Confirmation',
    HtmlBody: `
      <h1>Appointment Confirmed</h1>
      <p>Dear ${appointmentDetails.a_name},</p>
      <p>Your appointment for the following services has been confirmed:</p>
      <ul>
        ${appointmentDetails.a_service.map(service => `<li>${service}</li>`).join('')}
      </ul>
      <p><strong>Date:</strong> ${new Date(appointmentDetails.a_date).toLocaleDateString()}</p>
      <p><strong>Timeslot:</strong> ${appointmentDetails.a_timeslot}</p>
      <p><strong>Outlet:</strong> ${appointmentDetails.a_outlet}</p>
      <p><strong>Total Price:</strong> ₹${appointmentDetails.total_price}</p>
      <p><strong>Booking Price:</strong> ₹${appointmentDetails.booking_price}</p>
      ${appointmentDetails.a_specialrequest ? `<p><strong>Special Request:</strong> ${appointmentDetails.a_specialrequest}</p>` : ''}
      <p>Thank you for choosing our services! We look forward to seeing you.</p>
    `,
  }, (error, result) => {
    if (error) {
      console.error('Error sending confirmation email:', error);
    } else {
      console.log('Confirmation email sent:', result);
    }
  });
};

// Send reschedule email
const sendRescheduleEmail = (recipient, appointmentDetails) => {
  client.sendEmail({
    From: '2022.yash.rahate@ves.ac.in',
    To: recipient,
    Subject: 'Appointment Rescheduled',
    HtmlBody: `
      <h1>Appointment Rescheduled</h1>
      <p>Dear ${appointmentDetails.a_name},</p>
      <p>Your appointment for the following services has been rescheduled:</p>
      <ul>
        ${appointmentDetails.a_service.map(service => `<li>${service}</li>`).join('')}
      </ul>
      <p><strong>New Date:</strong> ${new Date(appointmentDetails.a_date).toLocaleDateString()}</p>
      <p><strong>New Timeslot:</strong> ${appointmentDetails.a_timeslot}</p>
      <p><strong>Outlet:</strong> ${appointmentDetails.a_outlet}</p>
      ${appointmentDetails.a_specialrequest ? `<p><strong>Special Request:</strong> ${appointmentDetails.a_specialrequest}</p>` : ''}
      <p>Thank you for rescheduling your appointment. We look forward to seeing you soon!</p>
    `,
  }, (error, result) => {
    if (error) {
      console.error('Error sending reschedule email:', error);
    } else {
      console.log('Reschedule email sent:', result);
    }
  });
};

module.exports = {
  sendConfirmationEmail,
  sendRescheduleEmail,
};
