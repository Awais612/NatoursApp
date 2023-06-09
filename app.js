const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
// MIDDLEWARE
app.use(express.json());

if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`))


app.use((req, res, next)=>{
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Handling Middleware
app.use(globalErrorController);

module.exports = app;
