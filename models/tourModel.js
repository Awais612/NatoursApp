const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a Name'],
    unique: true,
  },
  duration:{
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize:{
    type: Number,
    required: [true, 'A tour must have the group size declared!']
  },
  difficulty:{
    type: String,
    required: [true, 'A tour must have the difficulty'] 
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount:Number,
  summary: {
    type: String,
    trim: true,
    required:[true, "A tour must have a short summary"]
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDate: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;