const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["artist", "album", "track"],
      required: true,
    },
    item_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
