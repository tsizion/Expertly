const jwt = require("jsonwebtoken");
const AppError = require("../ErrorHandlers/appError");
const Admin = require("../admin/models/adminModel");

// Middleware to protect routes for user authentication

// Middleware to protect routes for agent authentication
exports.protectAgent = async (req, res, next) => {
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

    // Extracting agent id from the token payload
    const agentId = decoded.id;

    // Find the agent using the retrieved id
    const agent = await Agent.findById(agentId).populate("station"); // You can populate station if needed
    if (!agent) {
      return next(new AppError("Agent not found.", 404));
    }

    // Attach the agent to the request object for use in subsequent middleware or route handlers
    req.agent = agent;

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
