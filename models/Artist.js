const mongoose = require('mongoose');
const { v4: uuidv4 } = require("uuid"); // Import UUID function 

const artistSchema = new mongoose.Schema(
  {
    artist_id: {
      type: mongoose.Schema.Types.UUID, // Requires mongoose-uuid2 plugin for UUID
      default: () => require('uuid').v4(), // Use UUID v4 for unique IDs
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    grammy: {
      type: Number,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
