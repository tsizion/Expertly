const { Chapa } = require("chapa-nodejs");
const Appointment = require("../Appointment/models/Appointment"); // Appointment model
const Client = require("../Category/models/categoryModel"); // Client model

// Initialize Chapa with your secret key
const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY, // Load from environment variables
});

// Payment initialization function
exports.initializePayment = async (req, res) => {
  try {
    const clientIdFromToken = req.client.id;

    const { appointmentId } = req.params; // Appointment ID from request params

    // Fetch appointment details and populate client and expert info
    const appointment = await Appointment.findById(appointmentId)
      .populate("client") // Populating client details (firstName, lastName, email, phoneNumber)
      .populate("expert"); // Populating expert details (for description)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Fetch client details (from the populated appointment)
    const client = appointment.client;

    // Generate a unique transaction reference (tx_ref) for the payment
    const tx_ref = await chapa.genTxRef();

    // Initialize payment with Chapa API
    const response = await chapa.initialize({
      first_name: client.firstName, // Client's first name
      last_name: client.lastName, // Client's last name
      email: client.email, // Client's email
      phone_number: client.phoneNumber, // Client's phone number
      currency: "ETB", // Currency (Ethiopian Birr)
      amount: appointment.amount.toString(), // Appointment amount (dynamically set)
      tx_ref, // Transaction reference
      callback_url: `https://yourapp.com/api/payments/callback`, // Callback URL for payment verification
      return_url: `https://yourapp.com/success`, // Return URL after successful payment
      customization: {
        title: "Consultation Payment",
        description: `Payment for appointment with ${appointment.expert.name}`, // Descriptive text for payment
      },
    });

    // Respond with the Chapa payment URL for redirecting the client to complete payment
    return res.status(200).json({ paymentUrl: response.data.checkout_url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to initialize payment." });
  }
};
