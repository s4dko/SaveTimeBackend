const mongoose = require('mongoose');

require('dotenv').config();
const uriDb = process.env.URI_DB;

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  poolSize: 5,
});

mongoose.connection.on('connected', () => {
  console.log('Database connection successful');
});

mongoose.connection.on('error', error => {
  console.log(`Mongoose connection error: ${error.message}`);
  process.exit(1);
});

mongoose.connection.on('disconnected', () => {
  console.log(`Mongoose disconnected`);
});

process.on('SIGINT', async () => {
  mongoose.connection.close(() => {
    console.log('Disconnect DB');
    process.exit();
  });
});

module.exports = db;
