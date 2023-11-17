const express = require('express');
const { users } = require('./model');
const controller = require('./controller'),
      router = express.Router()
    

router.get("/",(req, res) =>{
    return res.render('index')
});
router.get("/reset-password",(req, res) =>{
    return res.render('resetPassword')
});
router.get("/set-password/:key",async (req, res) =>{
    try {
        const findData = await users.findFirst({
            where:{
                resetPasswordToken: req.params.key
            }
        })
        if(!findData){
            return res.render('error')
        }
        return res.render('setPassword',{user : findData})
    } catch (error) {
        return res.render('error')
    }
    
});

router.post('/api/v1/register', controller.register)
router.post('/api/v1/resetPassword', controller.resetPassword)
router.post('/api/v1/setPassword', controller.setPassword)

module.exports = router