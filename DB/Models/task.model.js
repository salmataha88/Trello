import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['toDo', 'doing', 'done'],
    default: 'toDo',
  },
  userId: { //owner
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  assignTo: {
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
});

export const taskmodel = model('Task', taskSchema);