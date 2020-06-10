const Project = require("../models/Projects");
const { validationResult } = require("express-validator");

exports.createProject = async (req, res) => {
  //revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  try {
    //crear nuevo proyecto
    const project = new Project(req.body);
    //guardar creador
    project.creator = req.user.id;
    //guardar proyecto
    project.save();
    res.json(project);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
};

// obtiene todos los proyectos del usuario actual

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ creator: req.user.id });
    res.json({ projects });
  } catch (error) {
    console.log(error);
    res.status(500).send("error found");
  }
};

//actualizar proyecto

exports.updateProject = async (req, res) => {
  //revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  //extraer info del proyecto
  const { name } = req.body;
  const newProject = {};
  if (name) {
    newProject.name = name;
  }

  try {
    //revisar el id
    let project = await Project.findById(req.params.id);
    //si el proyecto existe
    if(!project){
        return res.status(404).json({msg: "project not found"})
    }
    //verificar el creador
    if(project.creator.toString() !== req.user.id){
        return res.statur(401).json({msg: "no authorization"})
    }
    //actualizar
    project = await Project.findByIdAndUpdate({_id: req.params.id}, { $set : newProject}, { new: true});
        
        res.json({project})
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
};
//elimina proyecto por id
exports.deleteProject = async (req, res) => {
    try {
         //revisar el id
    let project = await Project.findById(req.params.id);
    //si el proyecto existe
    if(!project){
        return res.status(404).json({msg: "project not found"})
    }
    //verificar el creador
    if(project.creator.toString() !== req.user.id){
        return res.statur(401).json({msg: "no authorization"})
    }
    //eliminar proyecto
    await Project.findOneAndRemove({_id: req.params.id});
    res.json({msg: "project deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).send({msg: "server error"})
    }
}
