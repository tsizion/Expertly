const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Expert = require("../../Expert/models/expertModel");
const authUtils = require("../../utils/authUtils");
const Client = require("../../Client/models/Client");

exports.LoginAdmin = catchAsync(async (req, res, next) => {
  const { email, phoneNumber, password } = req.body;

  if ((!email && !phoneNumber) || !password) {
    return next(
      new AppError(
        "Email or phone number and password must be provided to log in.",
        401
      )
    );
  }

  let admin = null;

  if (email) {
    admin = await Admin.findOne({ email }).select("+password");
  } else if (phoneNumber) {
    admin = await Admin.findOne({ phoneNumber }).select("+password");
  }

  if (!admin) {
    return next(new AppError("Admin not found!", 404));
  }

  const isPasswordCorrect = await admin.correctPassword(password);

  if (isPasswordCorrect) {
    const token = await authUtils.signToken(admin._id); // Generate a token for the admin
    res.status(200).json({
      status: "success",
      token,
      admin, // Return the admin object (you can filter fields if needed)
    });
  } else {
    return next(new AppError("Incorrect phone number or password.", 403));
  }
});

exports.LoginExpert = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  // Validate required fields
  if (!phoneNumber || !password) {
    return next(
      new AppError("Phone number and password must be provided to log in.", 401)
    );
  }

  // Find the expert by phone number
  const expert = await Expert.findOne({ phoneNumber }).select("+password");

  // Check if expert exists
  if (!expert) {
    return next(new AppError("Expert not found!", 404));
  }

  // Check if the password is correct
  const isPasswordCorrect = await expert.correctPassword(password);
  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect phone number or password.", 403));
  }

  // Generate a token
  const token = await authUtils.signToken(expert._id);

  // Respond with success
  res.status(200).json({
    status: "success",
    token,
    expert, // Include expert data in the response
  });
});

exports.LoginClient = catchAsync(async (req, res, next) => {
  const { email, phoneNumber, password } = req.body;

  // Validate required fields
  if ((!email && !phoneNumber) || !password) {
    return next(
      new AppError(
        "Email or phone number and password must be provided to log in.",
        401
      )
    );
  }

  let client = null;

  // Find the client by email or phone number
  if (email) {
    client = await Client.findOne({ email }).select("+password");
  } else if (phoneNumber) {
    client = await Client.findOne({ phoneNumber }).select("+password");
  }

  // Check if client exists
  if (!client) {
    return next(new AppError("Client not found!", 404));
  }

  // Verify password
  const isPasswordCorrect = await client.correctPassword(password);
  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect email/phone number or password.", 403));
  }

  // Generate a token
  const token = await authUtils.signToken(client._id);

  // Respond with success
  res.status(200).json({
    status: "success",
    token,
    client, // Return the client object (you can filter fields if needed)
  });
});
