const mongoose = require('mongoose');
const Booking = require('../models/Booking');
require('dotenv').config();

const dummyBookings = [
    {
        customerName: "John Smith",
        customerEmail: "john.smith@example.com",
        customerPhone: "+1 (555) 123-4567",
        carType: "Sedan",
        pickupLocation: "123 Main Street, New York, NY",
        dropLocation: "456 Park Avenue, New York, NY",
        bookingDateTime: new Date("2024-03-25T10:00:00"),
        note: "Please arrive 5 minutes early",
        status: "pending"
    },
    {
        customerName: "Sarah Johnson",
        customerEmail: "sarah.j@example.com",
        customerPhone: "+1 (555) 987-6543",
        carType: "SUV",
        pickupLocation: "789 Broadway, New York, NY",
        dropLocation: "321 5th Avenue, New York, NY",
        bookingDateTime: new Date("2024-03-26T14:30:00"),
        note: "Need extra space for luggage",
        status: "confirmed"
    },
    {
        customerName: "Michael Brown",
        customerEmail: "michael.b@example.com",
        customerPhone: "+1 (555) 456-7890",
        carType: "Luxury",
        pickupLocation: "100 Wall Street, New York, NY",
        dropLocation: "200 Madison Avenue, New York, NY",
        bookingDateTime: new Date("2024-03-27T09:15:00"),
        status: "pending"
    },
    {
        customerName: "Emily Davis",
        customerEmail: "emily.d@example.com",
        customerPhone: "+1 (555) 234-5678",
        carType: "Van",
        pickupLocation: "500 7th Avenue, New York, NY",
        dropLocation: "600 8th Avenue, New York, NY",
        bookingDateTime: new Date("2024-03-28T16:45:00"),
        note: "Group of 6 people",
        status: "pending"
    }
];

const seedBookings = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing bookings
        await Booking.deleteMany({});
        console.log('Cleared existing bookings');

        // Insert new bookings
        const createdBookings = await Booking.insertMany(dummyBookings);
        console.log(`Successfully seeded ${createdBookings.length} bookings`);

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

// Run the seeder
seedBookings(); 