const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const router = express.Router();

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, customerName, customerEmail, customerPhone, pickupLocation, dropLocation } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!customerName || !customerEmail) {
      return res.status(400).json({ error: 'Customer name and email are required for export compliance' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd',
      payment_method_types: ['card'],
      capture_method: 'automatic',
      description: 'Limo booking service - Transportation and chauffeur service',
      receipt_email: customerEmail,
      shipping: {
        name: customerName,
        address: {
          line1: pickupLocation || 'US Address',
          city: 'United States',
          state: 'US',
          postal_code: '00000',
          country: 'US',
        },
      },
      metadata: {
        booking_id: req.body.bookingId || 'pending',
        service_type: 'limo_booking',
        country: 'US',
        export_description: 'Transportation and chauffeur service for limo booking',
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || '',
        pickup_location: pickupLocation || '',
        drop_location: dropLocation || '',
        customer_address: pickupLocation || 'US Address',
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment and send email to owner
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, bookingDetails } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Send email to owner with payment information
      const ownerMailOptions = {
        from: process.env.COMPANY_EMAIL,
        to: process.env.CAB_OWNER_EMAIL,
        subject: '💰 Payment Received - New Booking Confirmed',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="background-color: #4CAF50; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">💰 Payment Received!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">New booking confirmed with payment</p>
            </div>
            
            <div style="padding: 20px;">
              <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">Payment Details</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Amount Received:</td>
                  <td style="padding: 8px 0; font-weight: bold; color: #4CAF50; font-size: 18px;">$${(paymentIntent.amount / 100).toFixed(2)} USD</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Payment ID:</td>
                  <td style="padding: 8px 0; font-family: monospace; color: #333;">${paymentIntent.id}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Payment Status:</td>
                  <td style="padding: 8px 0; color: #4CAF50; font-weight: bold;">✅ Confirmed</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Payment Date:</td>
                  <td style="padding: 8px 0; color: #333;">${new Date(paymentIntent.created * 1000).toLocaleString()}</td>
                </tr>
              </table>

              <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">Customer Information</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Customer Name:</td>
                  <td style="padding: 8px 0; color: #333;">${bookingDetails?.customerName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td>
                  <td style="padding: 8px 0; color: #333;">${bookingDetails?.customerEmail || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Phone:</td>
                  <td style="padding: 8px 0; color: #333;">${bookingDetails?.customerPhone || 'N/A'}</td>
                </tr>
              </table>

              <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">Booking Details</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Vehicle Type:</td>
                  <td style="padding: 8px 0; color: #333;">${bookingDetails?.carType || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Pickup Date & Time:</td>
                  <td style="padding: 8px 0; color: #333;">${new Date(bookingDetails?.bookingDateTime).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Pickup Location:</td>
                  <td style="padding: 8px 0; color: #333;">${bookingDetails?.pickupLocation || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Drop-off Location:</td>
                  <td style="padding: 8px 0; color: #333;">${bookingDetails?.dropLocation || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Notes:</td>
                  <td style="padding: 8px 0; color: #333;">${bookingDetails?.note || 'No additional notes'}</td>
                </tr>
              </table>

              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #4CAF50;">
                <p style="margin: 0; color: #333; font-weight: bold;">🚗 Action Required:</p>
                <p style="margin: 5px 0 0 0; color: #666;">Please contact the customer within 30 minutes to confirm the booking and provide driver details.</p>
              </div>

              <div style="margin-top: 20px; padding: 15px; background-color: #e8f5e8; border-radius: 5px; text-align: center;">
                <p style="margin: 0; color: #2e7d32; font-weight: bold;">✅ Payment Successfully Processed</p>
                <p style="margin: 5px 0 0 0; color: #2e7d32;">The customer has been notified and is expecting your call.</p>
              </div>
            </div>
          </div>
        `
      };

      await transporter.sendMail(ownerMailOptions);

      res.json({
        success: true,
        paymentIntent,
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment not completed',
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Webhook to handle payment events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Here you can update your booking status, send confirmation emails, etc.
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router; 