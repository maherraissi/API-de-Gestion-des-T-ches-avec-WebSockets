const mangoose = require('mongoose');

const taskSchema = new mangoose.Schema({  

  title : {type : string , required : true},
  description : {type : string , required : true},
  status : {
    type : string,
    enum : ['pending', 'in-progress', 'completed'],
    default : 'pending'
  },
  createdAt : {type : Date, default : Date.now},
  completedAt : {type : Date, default : null}
});


//create a model from the schema
module.exports = mangoose.model('Task', taskSchema);
