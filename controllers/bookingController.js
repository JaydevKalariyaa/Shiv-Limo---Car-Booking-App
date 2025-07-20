const nodemailer = require('nodemailer');
const Booking = require('../models/Booking');
const ownerBookingTemplate = require('../templates/ownerBookingEmail');
const customerBookingTemplate = require('../templates/customerBookingEmail');

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();

        // Send email to cab owner
        const ownerMailOptions = {
            from: process.env.COMPANY_EMAIL,
            to: process.env.CAB_OWNER_EMAIL,
            subject: 'New Booking Request',
            html: ownerBookingTemplate(booking)
        };

        // Send email to customer
        // const customerMailOptions = {
        //     from: process.env.COMPANY_EMAIL,
        //     to: booking.customerEmail,
        //     subject: 'Booking Confirmation',
        //     html: customerBookingTemplate(booking)
        // };

        await transporter.sendMail(ownerMailOptions);
        // await transporter.sendMail(customerMailOptions);

        res.status(201).json({
            success: true,
            data: booking,
            message: 'Booking created successfully and confirmation emails sent'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update booking with payment information
exports.updateBookingPayment = async (req, res) => {
    try {
        const { bookingId, paymentIntentId, stripePaymentId } = req.body;
        
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                paymentStatus: 'paid',
                paymentIntentId,
                stripePaymentId,
                status: 'paid'
            },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            data: booking,
            message: 'Payment updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all bookings
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get single booking
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }
        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}; 