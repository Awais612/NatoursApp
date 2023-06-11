const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Catching uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNHANDLED Exception! 💥 SHUTTING DOWN...');
  console.log(err.name, err.message);
  process.exit(1);
});


dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console
      .log('DB connection successful')
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});

// Handling the unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 SHUTTING DOWN...');
  console.log(err.name, err.message);
  // process.exit(1); Not a preferred way to shutdown a application. As it suddenly shutdown all the processes.

  server.close(() => {
    // It will first close the server and then shutdown the application
    process.exit();
  });
});

