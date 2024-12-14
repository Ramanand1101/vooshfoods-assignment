const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  artist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
