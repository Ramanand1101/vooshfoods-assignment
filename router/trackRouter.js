const express = require('express');
const Track = require('../models/Track'); // Assuming trackSchema is saved in this file
const { verifyToken } = require('../middleware/auth'); // JWT authentication middleware

const trackRouter = express.Router();

trackRouter.get('/tracks', verifyToken, async (req, res) => {
  const { limit = 5, offset = 0, artist_id, album_id, hidden } = req.query;
  
  try {
    const filter = {};
    if (artist_id) filter.artist_id = artist_id;
    if (album_id) filter.album_id = album_id;
    if (hidden !== undefined) filter.hidden = hidden === 'true';

    const tracks = await Track.find(filter)
      .skip(Number(offset))
      .limit(Number(limit));

    res.status(200).json({
      status: 200,
      data: tracks,
      message: "Tracks retrieved successfully.",
      error: null,
    });
  } catch (error) {
    res.status(400).json({ message: "Error fetching tracks.", error });
  }
});
trackRouter.get('/tracks/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
  
    try {
      const track = await Track.findById(id);
      if (!track) {
        return res.status(404).json({
          status: 404,
          message: "Resource doesn't exist.",
          error: null,
        });
      }
  
      res.status(200).json({
        status: 200,
        data: track,
        message: "Track retrieved successfully.",
        error: null,
      });
    } catch (error) {
      res.status(400).json({ message: "Error fetching track.", error });
    }
  });
  trackRouter.post('/tracks/add-track', verifyToken, async (req, res) => {
    const { artist_id, album_id, name, duration, hidden } = req.body;
  
    if (!artist_id || !album_id || !name || !duration) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    try {
      const track = new Track({
        track_id: new UUID(),  // Use a method to generate UUID for the track
        artist_id,
        album_id,
        name,
        duration,
        hidden: hidden || false,
      });
  
      await track.save();
      res.status(201).json({
        status: 201,
        message: "Track created successfully.",
        error: null,
      });
    } catch (error) {
      res.status(400).json({ message: "Error adding track.", error });
    }
  });
  trackRouter.put('/tracks/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, duration, hidden } = req.body;
  
    try {
      const track = await Track.findById(id);
      if (!track) {
        return res.status(404).json({
          status: 404,
          message: "Resource doesn't exist.",
          error: null,
        });
      }
  
      track.name = name || track.name;
      track.duration = duration || track.duration;
      track.hidden = hidden !== undefined ? hidden : track.hidden;
  
      await track.save();
  
      res.status(204).json({
        status: 204,
        message: "Track updated successfully.",
        error: null,
      });
    } catch (error) {
      res.status(400).json({ message: "Error updating track.", error });
    }
  });
  trackRouter.delete('/tracks/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
  
    try {
      const track = await Track.findByIdAndDelete(id);
      if (!track) {
        return res.status(404).json({
          status: 404,
          message: "Resource doesn't exist.",
          error: null,
        });
      }
  
      res.status(200).json({
        status: 200,
        message: `Track: ${track.name} deleted successfully.`,
        error: null,
      });
    } catch (error) {
      res.status(400).json({ message: "Error deleting track.", error });
    }
  });
    


module.exports = trackRouter;
