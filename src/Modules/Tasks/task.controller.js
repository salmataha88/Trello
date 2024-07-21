import { taskmodel } from "../../../DB/Models/task.model.js";
import { usermodel } from "../../../DB/Models/user.model.js";

export const addTask = async (req, res, next) => {
    const { title, description, deadline , assignTo } = req.body;
    const userId = req.authUser._id;

    const checkUser = await usermodel.findById(assignTo);
    if(!checkUser){
       return res.status(400).json({ Message: 'Enter correct ID please..'});
    }
    if(!checkUser.isLogged){
      return res.status(400).json({ Message: 'User must logged in to assign to..'});
    }

    const deadlineDate = new Date(deadline);

    const currentDate = new Date();
    if (deadlineDate < currentDate) {
        return res.status(400).json({ Message: 'Deadline should be after the current date' });
    }

    const newTask = new taskmodel({
        title,
        description,
        userId,
        assignTo,
        deadline,
    });

    await newTask.save();
    res.status(201).json({ Message: 'Task created successfully', task: newTask });
}

export const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const loggedInUserId = req.authUser._id;
  const {title , description , status , assignTo} = req.body;

  const checkTask = await taskmodel.findById(id);
  
  if (!checkTask) {
    return res.status(400).json({ Message: 'Enter correct ID please..' });
  }

  if (checkTask.userId.toString() !== loggedInUserId.toString()) {
    return res.status(401).json({ Message: 'Unauthorized. Only the creator can update the task.' });
  }

  const checkUser = await usermodel.findById(assignTo);
  if(!checkUser){
    return res.status(400).json({ Message: 'Enter correct userID please..'});
  }
  if(!checkUser.isLogged){
    return res.status(400).json({ Message: 'User must logged in to assign to..'});
  }

  const newTask = await taskmodel.findByIdAndUpdate(id , {title , description , status , assignTo} , {new : true})
  res.status(201).json({ Message: 'Task updated successfully' , newTask});
}

export const deleteTask = async (req, res, next) => {
    const { taskID } = req.query;
    const loggedInUserId = req.authUser._id;
  
    const checkTask = await taskmodel.findById(taskID);
  
    if (!checkTask) {
      return res.status(400).json({ Message: 'Enter correct ID please..' });
    }
  
    if (checkTask.userId.toString() !== loggedInUserId.toString()) {
      return res.status(401).json({ Message: 'Unauthorized. Only the creator can delete the task.' });
    }
  
    await taskmodel.findByIdAndDelete(taskID);
    res.status(201).json({ Message: 'Task deleted successfully' });
}

export const getTasks = async (req, res, next) => {

  const checkTask = await taskmodel.find();

  if (!checkTask) {
    return res.status(400).json({ Message: 'No Tasks found..' });
  }

  res.status(201).json({ Tasks : checkTask});
}

export const getTasksWithUsers = async (req, res, next) => {

  const checkTask = await taskmodel.find()
    .populate('userId', 'username email')
    .populate('assignTo', 'username email');

  if (!checkTask) {
    return res.status(400).json({ Message: 'No Tasks found..' });
  }

  res.status(201).json({ Tasks : checkTask});
}

export const getTasksOfUser= async (req, res, next) => {

  const loggedInUserId = req.authUser._id;

  const checkTask = await taskmodel.find({ userId: loggedInUserId })
    .populate('assignTo', 'username email');

  if (!checkTask) {
    return res.status(400).json({ Message: 'No Tasks found..' });
  }

  res.status(201).json({ Tasks : checkTask});
}

export const getLateTasks= async (req, res, next) => {

  const currentDate = new Date();
  const lateTasks = await taskmodel.find({
    status: { $ne: 'Done' },
    deadline: { $lt: currentDate }
  })

  if (lateTasks.length === 0) {
    return res.status(400).json({ Message: 'No Tasks found..' });
  }

  res.status(201).json({ Tasks : lateTasks});
}