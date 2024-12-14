const express = require('express');
const albumRouter = express.Router();
const {verifyToken} = require('../middleware/auth'); // Import the verifyToken middleware
const Album = require('../models/Album'); // Assuming you have an Album model

// Route to fetch all albums with filters, limit, and offset
albumRouter.get('/albums', verifyToken, async (req, res) => {
  const { limit = 5, offset = 0, artist_id, hidden } = req.query;

  try {
    const query = {};

    if (artist_id) query.artist_id = artist_id;
    if (hidden !== undefined) query.hidden = hidden === 'true';

    const albums = await Album.find(query)
      .skip(Number(offset))
      .limit(Number(limit));

    if (albums.length === 0) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "No albums found with the provided filters.",
        error: "Not Found"
      });
    }

    res.status(200).json({
      status: 200,
      data: albums,
      message: "Albums retrieved successfully.",
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request.",
      error: err.message
    });
  }
});

// Route to fetch a specific album by ID
albumRouter.get('/albums/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const album = await Album.findById(id);

    if (!album) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Album not found.",
        error: "Resource Doesn't Exist"
      });
    }

    res.status(200).json({
      status: 200,
      data: album,
      message: "Album retrieved successfully.",
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request.",
      error: err.message
    });
  }
});

// Route to add one or more albums
albumRouter.post('/albums/add-album', verifyToken, async (req, res) => {
  const { albums } = req.body;

  // Check if the albums array is provided
  if (!albums || !Array.isArray(albums) || albums.length === 0) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request: No albums provided or invalid format.",
      error: "Bad Request"
    });
  }

  try {
    // Validate each album entry
    const validationErrors = [];
    const validAlbums = [];

    for (const album of albums) {
      const { artist_id, name, year, hidden } = album;

      if (!artist_id || !name || !year) {
        validationErrors.push({
          album,
          error: "Missing required fields: artist_id, name, or year."
        });
      } else {
        validAlbums.push({ artist_id, name, year, hidden });
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Some albums have validation errors.",
        error: validationErrors
      });
    }

    // Save all valid albums to the database
    const createdAlbums = await Album.insertMany(validAlbums);

    res.status(201).json({
      status: 201,
      data: createdAlbums,
      message: `${createdAlbums.length} albums created successfully.`,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request: Could not create albums.",
      error: err.message
    });
  }
});

// Route to update an album by ID
albumRouter.put('/albums/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, year, hidden } = req.body;

  try {
    const updatedAlbum = await Album.findByIdAndUpdate(
      id,
      { name, year, hidden },
      { new: true }
    );

    if (!updatedAlbum) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Album not found.",
        error: "Resource Doesn't Exist"
      });
    }

    res.status(204).json({
      status: 204,
      data: null,
      message: "Album updated successfully.",
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request: Could not update album.",
      error: err.message
    });
  }
});

// Route to delete an album by ID
albumRouter.delete('/albums/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAlbum = await Album.findByIdAndDelete(id);

    if (!deletedAlbum) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Album not found.",
        error: "Resource Doesn't Exist"
      });
    }

    res.status(200).json({
      status: 200,
      data: null,
      message: `Album: ${deletedAlbum.name} deleted successfully.`,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request: Could not delete album.",
      error: err.message
    });
  }
});

module.exports = albumRouter;
