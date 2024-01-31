exports.createProject = async (req, res) => {
    try {
      const { name, description, owner } = req.body;
      const newProject = new Project({ name, description, owner });
      await newProject.save();
      res.status(201).json(newProject);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
  // Logique pour récupérer tous les projets
  exports.getAllProjects = async (req, res) => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (error) {
      res.status(500).send(error);
    }
  };