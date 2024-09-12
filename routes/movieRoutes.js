const express = require('express');
const Movie = require('../models/movieModel');
const router = express.Router();

// Add new movie/web series
router.post('/movies', async (req, res) => {
  const { name, type, platform } = req.body;  // Get type from the request body
  try {
    const movie = new Movie({ name, type, platform });
    await movie.save();
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Error adding entry' });
  }
});

// Get all movies/web series
router.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching entries' });
  }
});

// Update movie/web series status and priority
router.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { status, priority } = req.body;
  try {
    const movie = await Movie.findByIdAndUpdate(
      id,
      { status, priority },
      { new: true }
    );
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Error updating entry' });
  }
});

// Delete movie/web series
router.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Movie.findByIdAndDelete(id);
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting entry' });
  }
});

module.exports = router;
