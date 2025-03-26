const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  title: { type: String , required: true},
  description: { type: String , required: true},
  completed: { type: Boolean, default: false },
  dueDate: { type: Date , default: Date.now},
  photos: { type: [String] , default: []},
  files: { type: [String] , default: []},
  tags: { type: [String] , default: [] },
  recommendation: { type: String , required: false },
},  { timestamps: true } 
);

const TaskModel = mongoose.model('Task' ,taskSchema);

module.exports = TaskModel;