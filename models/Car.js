const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: String,       // e.g. "Sedan"
  ratePerKm: Number   // optional
});

module.exports = mongoose.model('Car', carSchema);