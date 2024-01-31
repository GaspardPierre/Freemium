
exports.createTask = async (req, res) => {
    try {
      const { title, description, project } = req.body;
      const newTask = new Task({ title, description, project });
      await newTask.save();
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  exports.getTasksByProject = async (req, res) => {
    try {
      const { projectId } = req.params;
      const tasks = await Task.find({ project: projectId });
      res.json(tasks);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  