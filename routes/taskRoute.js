const express=require('express')
const router=express.Router({mergeParams:true});
const taskController=require('../controllers/taskController.js')

router.get('/',taskController.getTasksInProject);
router.get('/:taskId',taskController.getTaskById);

router.post('/add-task',taskController.createTask);




module.exports=router;
