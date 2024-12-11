const jwt = require("jsonwebtoken");
const AppError = require("../ErrorHandlers/appError");
const Admin = require("../admin/models/adminModel");
const Expert = require("../Expert/models/expertModel");
const Client = require("../Client/models/Client");

// Middleware to protect routes for admin authentication
exports.protectAdmin = async (req, res, next) => {
  try {
    let token;

    // Checking the Authorization header for the token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      return next(
        new AppError(
          "Not authorized. Please log in to access this resource.",
          401
        )
      );
    }

    // Verifying the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extracting admin id from the token payload
    const adminId = decoded.id;

    // Find the admin using the retrieved id
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return next(new AppError("Admin not found.", 404));
    }

    // Check if the user has the 'Admin' role
    if (admin.role !== "Admin" && admin.role !== "Super Admin") {
      return next(new AppError("User does not have admin rights.", 403));
    }

    // Attach the admin to the request object for use in subsequent middleware or route handlers
    req.admin = admin;

    next();
  } catch (error) {
    return next(
      new AppError(
        "Not authorized. Please log in to access this resource.",
        401
      )
    );
  }
};

// Middleware to protect routes for client authentication
exports.protectClient = async (req, res, next) => {
  try {
    let token;

    // Checking the Authorization header for the token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      return next(
        new AppError(
          "Not authorized. Please log in to access this resource.",
          401
        )
      );
    }

    // Verifying the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extracting client id from the token payload
    const clientId = decoded.id;

    // Find the client using the retrieved id
    const client = await Client.findById(clientId);
    if (!client) {
      return next(new AppError("Client not found.", 404));
    }

    // Attach the client to the request object for use in subsequent middleware or route handlers
    req.client = client;
    console.log(client);

    next();
  } catch (error) {
    return next(
      new AppError(
        "Not authorized. Please log in to access this resource.",
        401
      )
    );
  }
};

// Middleware to protect routes for expert authentication
exports.protectExpert = async (req, res, next) => {
  let token;

  // Checking the Authorization header for the token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(
      new AppError(
        "Not authorized. Please log in to access this resource.",
        401
      )
    );
  }

  // Verifying the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Extracting expert id from the token payload
  const expertId = decoded.id;

  // Find the expert using the retrieved id
  const expert = await Expert.findById(expertId);
  if (!expert) {
    return next(new AppError("Expert not found.", 404));
  }

  // Attach the expert to the request object for use in subsequent middleware or route handlers
  req.expert = expert;

  next();
};
