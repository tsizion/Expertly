const Transaction = require("../models/transactionmodel");
const Farmer = require("../../Farmer/models/farmerModel");
const Item = require("../../Item/models/item2");
const Agent = require("../../Agent/models/Agent"); // Assuming the agent model exists

// Helper function to check if the seller, buyer, items, and agent exist

// Create a new transaction
// Create a new transaction
exports.Create = async (req, res) => {
  try {
    const {
      seller,
      buyer,
      itemSold,
      itemBought,
      amountSold,
      amountBought,
      transactionValueInBirr,
      transactionType,
    } = req.body;

    const agentId = req.agent.id; // Automatically set the agentId from the request

    // Check if the references (seller, buyer, items, and agent) exist
    await checkReferencesExist(seller, buyer, itemSold, itemBought, agentId);

    const newTransaction = new Transaction({
      seller,
      buyer,
      itemSold,
      itemBought,
      amountSold,
      amountBought,
      transactionValueInBirr,
      transactionType,
      agentId, // Use the agentId extracted from the request
      status: "Pending", // Default status is Pending
    });

    const transaction = await newTransaction.save();
    res.status(201).json({
      status: "success",
      data: transaction,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Update an existing transaction
exports.Update = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const {
      seller,
      buyer,
      itemSold,
      itemBought,
      amountSold,
      amountBought,
      transactionValueInBirr,
      transactionType,
      status,
      agentId, // Include agentId in the request body
    } = req.body;

    // Check if the references (seller, buyer, items, and agent) exist
    await checkReferencesExist(seller, buyer, itemSold, itemBought, agentId);

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        seller,
        buyer,
        itemSold,
        itemBought,
        amountSold,
        amountBought,
        transactionValueInBirr,
        transactionType,
        agentId, // Update agentId as well
        status,
        updatedAt: Date.now(),
      },
      { new: true } // Return the updated document
    );

    if (!updatedTransaction) {
      return res.status(404).json({
        status: "fail",
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: updatedTransaction,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get all transactions
exports.ReadAll = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("seller", "fullName phoneNumber") // Populate seller details
      .populate("buyer", "fullName phoneNumber") // Populate buyer details
      .populate("itemSold", "name") // Populate sold item details
      .populate("itemBought", "name") // Populate bought item details
      .populate("agentId", "fullName"); // Populate agent details

    res.status(200).json({
      status: "success",
      results: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.ReadOneByAgent = catchAsync(async (req, res, next) => {
  const agentId = req.agent.id; // Extract the agent ID from the authenticated agent
  const { id } = req.params; // Get the transaction ID from the route

  // Find the transaction by ID and ensure it belongs to the authenticated agent
  const transaction = await Transaction.findOne({ _id: id, agentId })
    .populate("seller", "fullName phoneNumber location") // Include seller details
    .populate("buyer", "fullName phoneNumber location") // Include buyer details
    .populate("itemSold", "name description") // Include item sold details
    .populate("itemBought", "name description"); // Include item bought details;

  if (!transaction) {
    return next(new AppError("No transaction found for this agent", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      transaction,
    },
  });
});

// Get a single transaction by ID
exports.ReadOne = async (req, res) => {
  try {
    const transactionId = req.params.id;

    const transaction = await Transaction.findById(transactionId)
      .populate("seller", "fullName phoneNumber")
      .populate("buyer", "fullName phoneNumber")
      .populate("itemSold", "name")
      .populate("itemBought", "name")
      .populate("agentId", "fullName"); // Populate agent details

    if (!transaction) {
      return res.status(404).json({
        status: "fail",
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: transaction,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.ReadAllByAgent = catchAsync(async (req, res, next) => {
  const agentId = req.agent.id; // Extract agent ID from the authenticated agent

  // Fetch transactions filtered by agentId
  const transactions = await Transaction.find({ agentId })
    .populate("seller", "fullName phoneNumber location") // Include seller details
    .populate("buyer", "fullName phoneNumber location") // Include buyer details
    .populate("itemSold", "name description") // Include item sold details
    .populate("itemBought", "name description") // Include item bought details
    .lean();

  res.status(200).json({
    status: "success",
    results: transactions.length,
    data: {
      transactions,
    },
  });
});

// Delete a transaction
exports.Delete = async (req, res) => {
  try {
    const transactionId = req.params.id;

    const transaction = await Transaction.findByIdAndDelete(transactionId);

    if (!transaction) {
      return res.status(404).json({
        status: "fail",
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
