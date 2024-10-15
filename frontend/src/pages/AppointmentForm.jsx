import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError, handleSuccess } from "../utils";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./AppointmentForm.css";
import axios from "axios"; // Make sure axios is imported

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    service: [], // Changed to array to handle multiple services
    stylist: "",
    location: "",
    notes: "",
    referral: "",
  });

  const [totalPrice, setTotalPrice] = useState(0); // To store total price of selected services
  const [bookingPrice, setBookingPrice] = useState(0); // To store 25% of the total price
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Services and their corresponding prices
  const services = [
    { name: "Haircut", price: 500 },
    { name: "Hair Coloring", price: 1500 },
    { name: "Facial", price: 1000 },
    { name: "Manicure", price: 800 },
    { name: "Pedicure", price: 1000 },
    { name: "Bridal Makeup", price: 3000 },
    { name: "Bridal Mehndi", price: 2500 },
    { name: "Bridal Package", price: 7000 },
    { name: "Hair Spa", price: 1200 },
    { name: "Threading", price: 100 },
    { name: "Waxing (Full Body)", price: 1800 },
    { name: "Waxing (Arms)", price: 600 },
    { name: "Waxing (Legs)", price: 800 },
    { name: "Waxing (Underarms)", price: 400 },
    { name: "Nail Art", price: 1500 },
    { name: "Eyebrow Shaping", price: 200 },
    { name: "Makeup Consultation", price: 500 },
    { name: "Hair Straightening", price: 4000 },
    { name: "Hair Rebonding", price: 5000 },
    { name: "Hair Smoothening", price: 3500 },
    { name: "Keratin Treatment", price: 4500 },
    { name: "Beard Trim", price: 300 },
    { name: "Beard Styling", price: 600 },
    { name: "Head Massage", price: 700 },
    { name: "Foot Massage", price: 1000 },
    { name: "Body Massage", price: 2500 },
    { name: "Body Scrub", price: 1800 },
    { name: "Skin Whitening Facial", price: 2000 },
    { name: "Anti-Aging Facial", price: 3000 },
    { name: "Acne Treatment", price: 1500 },
  ];

  const location = useLocation();
  const { appointment } = location.state || {}; // Get the appointment object from the state
  useEffect(() => {
    if (appointment) {
      const formattedDate = appointment.a_date ? appointment.a_date.split("T")[0] : "";
  
      setFormData((prevData) => ({
        ...prevData,
        name: appointment.a_name || "",
        email: appointment.a_email || "",
        date: formattedDate, // Correctly formatted date
        time: appointment.a_timeslot || "",
        service: appointment.a_service || [],
        location: appointment.a_outlet || "",
        notes: appointment.a_specialrequest || "",
      }));
  
      // Calculate total price and booking price
      const selectedPrices = appointment.a_service.reduce((acc, serviceName) => {
        const service = services.find((s) => s.name === serviceName);
        return acc + (service ? service.price : 0);
      }, 0);
  
      setTotalPrice(selectedPrices);
      setBookingPrice(selectedPrices * 0.25);
    }
  }, [appointment]); // Removed services from dependencies
  

  const loginemailconfig = ()=>{
    const localEmail = localStorage.getItem("loggedInEmail");
    if (!localEmail) {
      return handleError("Local email not found. Please Login or Signup.");
    }

  };
  const handleLogout = (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInEmail");
    handleSuccess("User Logged out");
    setTimeout(() => {
      navigate("/home");
    }, 2000);
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;


    // Toggle the service selection
    const selectedServices = checked
      ? [...formData.service, value] // Add selected service
      : formData.service.filter((service) => service !== value); // Remove unselected service

    setFormData({ ...formData, service: selectedServices });

    // Calculate total price
    const selectedPrices = selectedServices.reduce((acc, serviceName) => {
      const service = services.find((s) => s.name === serviceName);
      return acc + (service ? service.price : 0);
    }, 0);

    setTotalPrice(selectedPrices);

    // Calculate booking price as 25% of total price
    setBookingPrice(selectedPrices * 0.25);
  };

  const handlePayment = async (amount) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/payment/createOrder",
        {
          amount: amount,
          currency: "INR", // or the currency you're using
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Access Razorpay key from VITE
        amount: response.data.amount,
        currency: response.data.currency,
        name: "Your Company Name",
        description: "Booking Appointment",
        order_id: response.data.id,
        handler: async function (response) {
          // Handle payment success here
          console.log(response);
          // Proceed with booking the appointment
          await bookAppointment();
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: "1234567890", // Optional: replace with actual contact
        },
        theme: {
          color: "#F37254", // Customize your button color
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error creating payment order:", error);
      handleError("Payment initiation failed. Please try again.");
    }
  };

  const bookAppointment = async () => {
    try {
      // Retrieve local_email from local storage
      const localEmail = localStorage.getItem("loggedInEmail");
      if (!localEmail) {
        return handleError("Local email not found. Please Login or Signup.");
      }

      const url = `http://localhost:3000/appointments/book`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          a_name: formData.name,
          a_email: formData.email,
          a_date: formData.date,
          a_timeslot: formData.time,
          a_service: formData.service, // Send array of selected services
          a_outlet: formData.location,
          a_specialrequest: formData.notes,
          local_email: localEmail,
          total_price: totalPrice, // Include total price
          booking_price: bookingPrice, // Include booking price
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong!");
      }

      const result = await response.json();
      console.log("Appointment booked successfully:", result);

      // Display success message or perform any action after successful booking
      handleSuccess("Appointment booked successfully!");

      // Reset form data and total price
      setFormData({
        name: "",
        email: "",
        date: "",
        time: "",
        service: [],
        stylist: "",
        location: "",
        notes: "",
        referral: "",
      });
      setTotalPrice(0);
      setBookingPrice(0);
    } catch (error) {
      console.error("Error booking appointment:", error.message);
      handleError(error.message || "Failed to book appointment");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.date ||
      formData.service.length === 0
    ) {
      return handleError(
        "Name, Email, Date, and at least one Service are required!"
      );
    }

    // Proceed to payment with the booking price
    handlePayment(bookingPrice);
  };

  return (
    <>
      <Navbar handleLogout={handleLogout} />
      <div className="appointment-page-wrapper">
        <div className="appointment-form-container">
          <h2 className="appointment-form-heading">
            Get Your Salon Appointment Now!
          </h2>
          <form
            className="appointment-appointment-form"
            onSubmit={handleSubmit}
          >
            {/* Row 1: Name and Email */}
            <div className="appointment-form-row">
              <div className="appointment-form-group">
                <label htmlFor="name" className="appointment-form-label">
                  Full Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Your name"
                  className="appointment-form-input"
                  required
                />
              </div>
              <div className="appointment-form-group">
                <label htmlFor="email" className="appointment-form-label">
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Your email address"
                  className="appointment-form-input"
                  required
                />
              </div>
            </div>

            {/* Row 2: Date, Time, Location, and Service */}
            <div className="appointment-form-row">
              <div className="appointment-form-group">
                <label htmlFor="date" className="appointment-form-label">
                  Appointment Date*
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="appointment-form-input"
                  min={new Date().toISOString().split("T")[0]} // Restrict past dates
                  required
                />
              </div>
              <div className="appointment-form-group">
                <label htmlFor="time" className="appointment-form-label">
                  Preferred Time Slot*
                </label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="appointment-form-select"
                  required
                >
                  <option value="">Choose a time slot</option>
                  <option value="10:00 AM - 11:00 AM">
                    10:00 AM - 11:00 AM
                  </option>
                  <option value="11:00 AM - 12:00 PM">
                    11:00 AM - 12:00 PM
                  </option>
                  <option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>
                  <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
                  <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
                  <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
                  <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
                  <option value="5:00 PM - 6:00 PM">5:00 PM - 6:00 PM</option>
                  <option value="6:00 PM - 7:00 PM">6:00 PM - 7:00 PM</option>
                </select>
              </div>
              <div className="appointment-form-group">
                <label htmlFor="location" className="appointment-form-label">
                  Select Location*
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="appointment-form-select"
                  required
                >
                  <option value="">Choose a location</option>
                  <option value="Thane">Thane</option>
                  <option value="Vile Parle">Vile Parle</option>
                  <option value="Chembur">Chembur</option>
                  <option value="Andheri">Andheri</option>
                  <option value="Bandra">Bandra</option>
                  <option value="Juhu">Juhu</option>
                  <option value="Powai">Powai</option>
                  <option value="Goregaon">Goregaon</option>
                  <option value="Dadar">Dadar</option>
                </select>
              </div>
            </div>

            {/* Row 3: Services */}
            <div className="appointment-form-row">
              <div className="appointment-form-group">
                <label className="appointment-form-label">
                  Select Services*
                </label>
                <div className="appointment-services-grid">
                  {services.map((service) => (
                    <div
                      key={service.name}
                      className="appointment-service-item"
                    >
                      <input
                        type="checkbox"
                        id={service.name}
                        value={service.name}
                        onChange={handleCheckboxChange}
                      />
                      <label
                        htmlFor={service.name}
                        className="appointment-form-checkbox-label"
                      >
                        {service.name} - ₹{service.price}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 4: Notes */}
            <div className="appointment-form-row">
              <div className="appointment-form-group">
                <label htmlFor="notes" className="appointment-form-label">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Any special requests or notes"
                  className="appointment-form-textarea"
                />
              </div>
            </div>

            {/* Total and Booking Price */}
            <div className="appointment-price-row">
              <span>Total Price: ₹{totalPrice}</span>
              <span>Booking Price (25%): ₹{bookingPrice}</span>
            </div>
            <div className="appointment-form-row">
              <div className="appointment-form-group">
                <button onClick={loginemailconfig} type="submit" className="appointment-form-submit-btn">
                  Book Appointment
                </button>
              </div>
            </div>
          </form>
          {message && <div className="appointment-form-message">{message}</div>}
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </>
  );
};

export default AppointmentForm;
