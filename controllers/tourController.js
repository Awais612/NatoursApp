const fs = require('fs');

// Get Request Handler
// FILE READING
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour Id is: ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next)=>{
  if(!req.body.name || !req.body.price){
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price for the tour'
    });
  }
  next();
}

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
};

// Handling the URL requests
exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
};

// Post Request Handler
exports.postTour = (req, res) => {
  // console.log(req.body);
  // Saving the data to the file in the json format
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);
  tours.push(newTour);
  // Writing to the file
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      console.log('Error Occurred while writing data to the file!', err);
      res.status(201).json({
        status: 'Success',
        tour: newTour,
      });
    }
  );
};

// Patch request handler
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<.......Updated tour here......>',
    },
  });
};

// Delete Request Handler
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
