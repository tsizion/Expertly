const Transaction = require("../models/transactionmodel");
const Farmer = require("../../Farmer/models/farmerModel");
const Item = require("../../Item/models/item2");
const Agent = require("../../Agent/models/Agent"); // Assuming the agent model exists

// Helper function to check if the seller, buyer, items, and agent exist
const checkReferencesExist = async (
  sellerId,
  buyerId,
  itemSoldId,
  itemBoughtId,
  agentId
) => {
  const sellerExists = await Farmer.findById(sellerId);
  const buyerExists = await Farmer.findById(buyerId);
  const itemSoldExists = await Item.findById(itemSoldId);
  const itemBoughtExists = await Item.findById(itemBoughtId);
  const agentExists = await Agent.findById(agentId); // Check if agent exists

  if (
    !sellerExists ||
    !buyerExists ||
    !itemSoldExists ||
    !itemBoughtExists ||
    !agentExists
  ) {
    throw new Error("Seller, buyer, item(s), or agent not found");
  }
};

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
      agentId, // Include agentId in the request body
    } = req.body;

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
      agentId, // Add agentId to the new transaction
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
