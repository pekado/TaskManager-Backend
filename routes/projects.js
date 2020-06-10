const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
//crea proyectos
//api/projects
router.post("/", 
    auth,
    [
        check('name', "You must add a project name.").not().isEmpty()
    ],
    projectController.createProject
 );
//obtener proyectos
 router.get("/", 
    auth,
    projectController.getProjects
 );
//actualizar proyecto via ID    
router.put("/:id", 
    auth,
    [
        check('name', "You must add a project name.").not().isEmpty()
    ],
    projectController.updateProject
 );

 //eliminar proyecto
 router.delete("/:id", 
    auth,
    projectController.deleteProject
 );
module.exports = router;
