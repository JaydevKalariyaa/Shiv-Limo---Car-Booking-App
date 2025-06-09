const ownerBookingTemplate = (booking) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Ride Request</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f0f0; font-family:Arial, sans-serif; color:#333;">
    <table cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0f0f0;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" width="600" style="background-color:#fff; border-radius:8px; border:1px solid #dadce0; box-shadow:0 2px 8px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.12); overflow:hidden;">
                    <!-- Header -->
                    <tr>
                        <td align="center" bgcolor="#1a73e8" style="padding:20px;">
                            <h1 style="color:#fff; margin:0; font-size:24px;">You Have a New Ride Request</h1>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding:20px;">
                            <p style="margin:0 0 16px; color:#202124;">Someone has added a ride to your car. Here are the details:</p>

                            <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                                ${[
                                    { label: 'Customer Name', value: booking.customerName },
                                    { label: 'Phone Number', value: booking.customerPhone },
                                    { label: 'Email', value: booking.customerEmail },
                                    { label: 'Car Type', value: booking.carType },
                                    { label: 'Pickup Location', value: booking.pickupLocation },
                                    { label: 'Drop Location', value: booking.dropLocation },
                                    { label: 'Date & Time', value: new Date(booking.bookingDateTime).toLocaleString() },
                                    booking.note ? { label: 'Note', value: booking.note } : null
                                ]
                                .filter(Boolean)
                                .map(item => `
                                <tr style="border-bottom:1px solid #e8eaed;">
                                    <td style="padding:12px 20px; font-weight:bold; color:#202124; width:150px;">${item.label}:</td>
                                    <td style="padding:12px 20px; color:#202124;">${item.value}</td>
                                </tr>`).join('')}
                            </table>

                            <!-- Call Now Button -->
                            <div style="margin-top:30px; text-align:center;">
                                <a href="tel:${booking.customerPhone}" 
                                   style="display:inline-block; background-color:#1a73e8; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-size:16px; box-shadow:0 2px 6px rgba(26,115,232,0.2);">
                                    📞 Call Now
                                </a>
                            </div>

                            <!-- Additional Info -->
                            <div style="margin-top:20px; padding:15px; background-color:#e8f0fe; border-radius:6px;">
                                <p style="margin:0; color:#1a73e8; font-size:14px;">
                                    💡 Tip: Click the "Call Now" button above to contact the customer directly.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding:20px; font-size:12px; color:#5f6368; background-color:#f8f9fa; border-top:1px solid #e8eaed;">
                            This is an automated message. Please do not reply to this email.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

module.exports = ownerBookingTemplate;
