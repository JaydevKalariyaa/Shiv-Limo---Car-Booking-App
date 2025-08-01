const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBooking,
  updateBookingPayment,
  // updateBookingStatus
} = require("../controllers/bookingController");

// Create a new booking
router.post("/", createBooking);

// Get all bookings
router.get("/", getBookings);

// Get single booking
router.get("/:id", getBooking);

// Update booking payment
router.patch("/payment", updateBookingPayment);

// Update booking status
// router.patch('/:id/status', updateBookingStatus);

module.exports = router; 