const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, "Customer name is required"],
  },
  customerEmail: {
    type: String,
    required: [true, "Customer email is required"],
  },
  customerPhone: {
    type: String,
    required: [true, "Customer phone is required"],
  },

  carType: {
    type: String,
    required: [true, "Car type is required"],
  },
  pickupLocation: {
    type: String,
    required: [true, "Pickup location is required"],
  },
  dropLocation: {
    type: String,
    required: [true, "Drop location is required"],
  },
  bookingDateTime: {
    type: Date,
    required: [true, "Booking date is required"],
  },
  estimatedFare: {
    type: Number,
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "paid"],
    default: "pending",
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },

  paymentIntentId: {
    type: String,
  },

  stripePaymentId: {
    type: String,
  },

  note: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', bookingSchema);