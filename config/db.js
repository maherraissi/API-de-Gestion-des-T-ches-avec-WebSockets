const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/task_management';  

mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {a
    console.log('MongoDB connection error: ', err);
  });
