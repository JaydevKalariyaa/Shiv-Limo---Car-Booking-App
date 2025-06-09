const customerBookingTemplate = (booking) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #2196F3;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 0 0 5px 5px;
        }
        .booking-details {
            background-color: white;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .detail-item {
            margin: 10px 0;
            padding: 8px;
            border-bottom: 1px solid #eee;
        }
        .detail-item:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #2196F3;
        }
        .booking-id {
            background-color: #e3f2fd;
            padding: 10px;
            border-radius: 5px;
            margin: 15px 0;
            text-align: center;
            font-size: 1.1em;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 0.9em;
        }
        .contact-info {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Booking Confirmation</h1>
    </div>
    <div class="content">
        <p>Thank you for choosing our service! Your booking has been confirmed.</p>
        
        <div class="booking-id">
            Booking ID: ${booking._id}
        </div>

        <div class="booking-details">
            <div class="detail-item">
                <span class="label">Pickup Location:</span>
                <span>${booking.pickupLocation}</span>
            </div>
            <div class="detail-item">
                <span class="label">Drop Location:</span>
                <span>${booking.dropLocation}</span>
            </div>
            <div class="detail-item">
                <span class="label">Date & Time:</span>
                <span>${new Date(booking.bookingDateTime).toLocaleString()}</span>
            </div>
            <div class="detail-item">
                <span class="label">Car Type:</span>
                <span>${booking.carType}</span>
            </div>
        </div>

        <div class="contact-info">
            <h3>Need to make changes?</h3>
            <p>If you need to modify or cancel your booking, please contact us at:</p>
            <p>Phone: ${process.env.COMPANY_PHONE || 'Your Company Phone'}</p>
            <p>Email: ${process.env.COMPANY_EMAIL}</p>
        </div>

        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>Thank you for choosing our service!</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = customerBookingTemplate; 