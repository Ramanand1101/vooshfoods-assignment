const express = require("express");
const favoriteRouter = express.Router();
const Favorite = require("../models/Favorite");
const { verifyToken } = require("../middleware/auth"); // Token-based authentication

// Middleware for authentication
favoriteRouter.use(verifyToken);

// GET /favorites/:category - Retrieve Favorites
favoriteRouter.get("/favorites/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 5, offset = 0 } = req.query;
    const userId = req.user.id; // User ID from token

    const favorites = await Favorite.find({ user_id: userId, category })
      .skip(Number(offset))
      .limit(Number(limit));

    res.status(200).json({
      status: 200,
      data: favorites,
      message: "Favorites retrieved successfully.",
      error: null,
    });
  } catch (error) {
    res.status(400).json({ status: 400, message: "Bad Request", error: error.message });
  }
});

// POST /favorites/add-favorite - Add a Favorite
favoriteRouter.post("/favorites/add-favorite", async (req, res) => {
  try {
    const { category, item_id, name } = req.body;
    const userId = req.user.id; // User ID from token

    // Check for duplicate favorite
    const exists = await Favorite.findOne({ user_id: userId, category, item_id });
    if (exists) {
      return res.status(400).json({ status: 400, message: "Favorite already exists", error: null });
    }

    const newFavorite = new Favorite({ category, item_id, name, user_id: userId });
    await newFavorite.save();

    res.status(201).json({
      status: 201,
      data: null,
      message: "Favorite added successfully.",
      error: null,
    });
  } catch (error) {
    res.status(400).json({ status: 400, message: "Bad Request", error: error.message });
  }
});

// DELETE /favorites/remove-favorite/:id - Remove a Favorite
favoriteRouter.delete("/favorites/remove-favorite/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // User ID from token

    const favorite = await Favorite.findOneAndDelete({ _id:id, user_id: userId });

    if (!favorite) {
      return res.status(404).json({ status: 404, message: "Favorite not found", error: null });
    }

    res.status(200).json({
      status: 200,
      data: null,
      message: "Favorite removed successfully.",
      error: null,
    });
  } catch (error) {
    res.status(400).json({ status: 400, message: "Bad Request", error: error.message });
  }
});

module.exports = favoriteRouter;
