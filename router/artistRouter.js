const express = require('express');
const artistRouter = express.Router();
const { verifyToken } = require('../middleware/auth'); // Authentication middleware
const Artist = require('../models/Artist'); // Artist model
// 1. GET /artists - Retrieve All Artists
artistRouter.get('/artists', verifyToken, async (req, res) => {
    const { limit = 5, offset = 0, grammy, hidden } = req.query;
  
    try {
      // Ensure that the token is valid (already checked by `verifyToken`)
      if (!req.user.role) {
        return res.status(401).json({
          status: 401,
          data: null,
          message: "Unauthorized: No valid token provided.",
          error: "Unauthorized Access.",
        });
      }
  
      const query = {};
      if (grammy !== undefined) query.grammy = grammy === 'true';
      if (hidden !== undefined) query.hidden = hidden === 'true';
  
      const artists = await Artist.find(query)
        .skip(parseInt(offset, 10))
        .limit(parseInt(limit, 10));
  
      res.status(200).json({
        status: 200,
        data: null ,
        message: "Artists retrieved successfully.",
        error: null,
      });
    } catch (error) {
      console.error(error);
  
      // Handling 400 - Bad Request for invalid query or database errors
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Bad Request: Invalid query parameters or data format.",
          error: error.message,
        });
      }
  
      // Catch-all for other errors
      return res.status(500).json({
        status: 500,
        data: null,
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  });
  

// 2. GET /artists/:id - Retrieve an Artist
artistRouter.get('/artists/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
  
    try {
      // Retrieve the artist by ID
      const artist = await Artist.findById(id);
      
      if (!artist) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "Artist not found.",
          error: "No artist found with the provided ID.",
        });
      }
  
      // Authorization: Ensure the logged-in user has permission to view the artist
      if (req.user.role !== 'Editor' && req.user.id !== artist.ownerId.toString()) {
        return res.status(403).json({
          status: 403,
          data: null,
          message: "Forbidden Access: You do not have permission to access this artist.",
          error: "Forbidden Access."
        });
      }
  
      // Return artist data if found
      res.status(200).json({
        status: 200,
        data: {
          artist_id: artist._id,
          name: artist.name,
          grammy: artist.grammy,
          hidden: artist.hidden,
        },
        message: "Artist retrieved successfully.",
        error: null
      });
  
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: 400,
        data: null,
        message: "Bad Request: Invalid request or malformed parameters.",
        error: error.message,
      });
    }
  });

// 3. POST /artists/add-artist - Add a new Artist
artistRouter.post('/artists/add-artist', verifyToken, async (req, res) => {
    try {
      // Destructure body and validate inputs
      const { name, grammy, hidden } = req.body;
  
      // Validation: Check for missing or invalid fields
      if (!name || typeof grammy !== 'boolean' || typeof hidden !== 'boolean') {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Bad Request: 'name' is required, and 'grammy' and 'hidden' must be boolean values.",
          error: null,
        });
      }
  
      // Create a new artist instance
      const newArtist = new Artist({ name, grammy, hidden });
      
      // Save artist to the database
      await newArtist.save();
  
      // Send success response
      res.status(201).json({
        status: 201,
        data: null,
        message: "Artist created successfully.",
        error: null,
      });
    } catch (error) {
      // Handle unexpected errors
      console.error(error);
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  });
  
// 4. PUT /artists/:id - Update an Artist
artistRouter.put('/artists/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    const artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Artist not found.",
        error: null,
      });
    }

    Object.assign(artist, updateFields);
    await artist.save();

    res.status(200).json({
      status: 200,
      data: artist,
      message: "Artist updated successfully.",
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request.",
      error: error.message,
    });
  }
});

// 5. DELETE /artists/:id - Delete an Artist
artistRouter.delete('/artists/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Artist not found.",
        error: null,
      });
    }

    const artistName = artist.name;
    await artist.remove();

    res.status(200).json({
      status: 200,
      data: { artist_id: id },
      message: `Artist: ${artistName} deleted successfully.`,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request.",
      error: error.message,
    });
  }
});

module.exports = artistRouter;
