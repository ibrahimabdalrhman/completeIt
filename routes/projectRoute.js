const express=require('express')
const router=express.Router(0);
const projectController=require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');



router.get('/',authMiddleware,projectController.getAll);

router.post('/new-project',authMiddleware,projectController.createProject);

router.patch('/:projectId/add-admin',authMiddleware,projectController.addAdminsForProject);
router.patch('/:projectId/add-user',authMiddleware,projectController.addUsersForProject);






module.exports=router;
