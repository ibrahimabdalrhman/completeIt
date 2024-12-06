const express=require('express')
const router=express.Router(0);
const userController=require('../controllers/userController')

router.post('/signup',userController.createUser)
router.post('/login', userController.login)





module.exports=router;
