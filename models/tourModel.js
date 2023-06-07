const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a Name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A name must be of max 40 characters'],
      minlength: [6, 'A tour must be of minimum 6 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contains the alphabets']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have the group size declared!'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have the difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty should be easy or medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A tour must have a minimum rating average of 1'],
      max: [5, 'A tour must have maximum of rating average of 5']
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val){
          // This will only points to the current doc on NEW document creation.
          return val < this.price;
        },
        message: 'Discounted price ({VALUE}) should be less than the regular price'
      }
      
      
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a short summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secreteTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document Middleware: runs before .save() and .create() mongoose methods only
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function(doc, next){
//     console.log(doc);
//     next();
// })

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next){
tourSchema.pre(/^find/, function (next) {
  this.find({ secreteTour: { $ne: true } });

  this.start = Date.now();
  next();
});

// tourSchema.post(/^find/, function(docs, next){
// console.log(docs);
//   next();
// });

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secreteTour: { $ne: true } } });

  // console.log(this);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
