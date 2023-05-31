const fs = require('fs');
const express = require('express');
const morgan = require('morgan');




const app = express();
// MIDDLEWARES
// Middleware to handle the request for the post request in the express to handle the json request from the client
app.use(express.json());
app.use(morgan('dev'));

// Creating our own middleware
app.use((req, res, next)=>{
  console.log('Hello from the custom middleware 👋');
  next();
});

// Handling the request params
app.use((req, res, next)=>{
  req.requestTime = new Date().toISOString();
  next();
});



// Get Request Handler
// FILE READING
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);


/*****************************************Tours Controller*************************************************/
const getAllTours = (req, res) => {
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
const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  // if(!tour)   //Another possible solution to avoid the invalid request
  if (id > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
};

// Post Request Handler
const postTour = (req, res) => {
  // console.log(req.body);
  // Saving the data to the file in the json format
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);
  tours.push(newTour);
  // Writing to the file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<.......Updated tour here......>',
    },
  });
};

// Delete Request Handler
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

/*********************************************USER CONTROLLER************************************************/
const getAllUsers = (req, res)=>{
  res.status(500).json({
    status: 'error',
    message : 'This route is not defined yet!'
  });
}
const createUser= (req, res)=>{
  res.status(500).json({
    status: 'error',
    message : 'This route is not defined yet!'
  });
}
const getUser = (req, res)=>{
  res.status(500).json({
    status: 'error',
    message : 'This route is not defined yet!'
  });
}
const updateUser = (req, res)=>{
  res.status(500).json({
    status: 'error',
    message : 'This route is not defined yet!'
  });
}
const deleteUser = (req, res)=>{
  res.status(500).json({
    status: 'error',
    message : 'This route is not defined yet!'
  });
}

// Mounting the Routers
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(postTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);


// Defining routes for the users resource
userRouter.route('/').get(getAllUsers).post(createUser);

userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);


  app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
