const TaskModel = require("../models/task-model");
const UserModel = require("../models/user-model");
const {getRecommendationForTask} = require('../middlewares/openai-middleware');

const TaskController = {
  getAllTaskByUserId: async function (req, res) {
    const userId = req.user.id;
    let { page , limit} = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page -1) * limit;
     try {
      const tasks = await TaskModel.find({ userId }).skip(skip).limit(limit);

      const totalTasks = await TaskModel.countDocuments({userId});
      if (!tasks) {
        return res
          .status(404)
          .json({ message: "No tasks found for this user!" });
      }
      return res
        .status(200)
        .json({ currentPage :page , totalPages : Math.ceil(totalTasks/ limit), totalTasks : totalTasks , tasks: tasks, message: "Task successfully retrieved!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getTaskById: async function (req, res) {
    const { id } = req.params;
    try {
      const task = await TaskModel.findById(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found!" });
      }
      return res
        .status(200)
        .json({ task: task, message: "Task successfully retrieved!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  createTask: async function (req, res ) {
    const { title, description, completed, dueDate, tags } = req.body;
    const recommendation= await getRecommendationForTask(description);
    const userAuthenticate = req.user.id;
    console.log("Task Req Body : ", req.body);
    console.log("User Authenticate : ", req.user.id);

    const photoPaths =
      req.files && req.files.photos
        ? req.files.photos.map((file) => file.path.replace(/\\/g, "/"))
        : [];
    const filePaths =
      req.files && req.files.files
        ? req.files.files.map((file) => file.path.replace(/\\/g, "/"))
        : [];
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);

    try {
      const user = await UserModel.findById(userAuthenticate);
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      const newTask = new TaskModel({
        userId: userAuthenticate,
        title,
        description,
        completed,
        dueDate: dueDate ? new Date(dueDate) : null,
        tags : parsedTags,
        photos: photoPaths,
        files: filePaths,
        recommendation : recommendation
      });

      console.log("New Task : ", newTask);
      const saveNewTask = await newTask.save();
      return res
        .status(201)
        .json({
          newTask: saveNewTask,
          message: "Congratz! You create a new task!",
        });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateTask: async function (req, res) {
    const { id } = req.params;
    const { title, description, completed, dueDate, tags } = req.body;
    const recommendation = await getRecommendationForTask(description);  
    console.log(recommendation);
    const photoPaths =
      req.files && req.files.photos
        ? req.files.photos.map((file) => file.path.replace(/\\/g, "/"))
        : [];
    const filePaths =
      req.files && req.files.files
        ? req.files.files.map((file) => file.path.replace(/\\/g, "/"))
        : [];
        const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);

    try {
      const task = await TaskModel.findById(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found!" });
      }
      
      task.title = title || task.title;
      task.description = description || task.description;
      task.completed = completed || task.completed;
      task.dueDate = dueDate || task.dueDate;
      task.tags = parsedTags || task.tags;
      task.recommendation = recommendation || task.recommendation
      if (photoPaths.length > 0) {
        let currentPhotos = task.photos || [];
        const maxPhotos = 5;
        if (currentPhotos.length >= maxPhotos) {
          return res
            .status(400)
            .json({ message: "Photos limit has been achieved!" });
        }
        const existingPhotos = [
          currentPhotos[0],
          ...photoPaths.slice(0, maxPhotos - currentPhotos.length),
        ];
        currentPhotos = [
          ...existingPhotos,
          ...photoPaths.slice(existingPhotos.length),
        ];
        task.photos = currentPhotos.slice(0, maxPhotos);
      }
      if (filePaths.length > 0) {
        let currentFiles = task.files || [];
        const maxFiles = 3;
        if (currentFiles.length >= maxFiles) {
          return res
            .status(400)
            .json({ message: "Files limit has been achieved!" });
        }
        const existingFiles = [
          currentFiles[0],
          ...filePaths.slice(0, maxFiles - currentFiles.length),
        ];
        currentFiles = [
          ...existingFiles,
          ...filePaths.slice(existingFiles.length),
        ];
        task.files = currentFiles.slice(0, maxFiles);
      }
      const updatedTask = await task.save();
      return res
        .status(200)
        .json({
          updatedTask: updatedTask,
          message: "Task updated successfully!",
        });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteTask: async function (req, res) {
    const { id } = req.params;
    try {
      const task = await TaskModel.findByIdAndDelete(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found!" });
      }
      return res.status(200).json({ message: "Task deleted successfully!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = TaskController;
