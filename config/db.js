const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/task_management';  

mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.log('MongoDB connection error: ', err);
  });
