const { Schema, model } = require('mongoose');

const trackSchema = new Schema({
  track_id: { type: Schema.Types.UUID, required: true, unique: true },
  name: { type: String, required: true },
  duration: { type: Number, required: true },  // Duration in seconds
  hidden: { type: Boolean, default: false },
  artist_id: { type: Schema.Types.UUID, required: true },
  album_id: { type: Schema.Types.UUID, required: true },
});

module.exports = model('Track', trackSchema);
