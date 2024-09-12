const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },  // New field: Movie or Web Series
  platform: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now },  // Automatically adds current date
  status: { type: String, default: 'To Watch' },
  priority: { type: Number, default: 0 }
});

module.exports = mongoose.model('Movie', movieSchema);
