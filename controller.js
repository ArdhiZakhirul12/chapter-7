const { users } = require('./model')
const utils = require('./utils')
const nodemailer = require('nodemailer')

module.exports={
    register: async(req, res) => {
        try {
            const createdUser = await users.create({
                data: {
                    email: req.body.email,
                    password: await utils.cryptPassword(req.body.password),                            
                }
            })
            res.status(201).json(createdUser);
        } catch (error) {
            console.error(error)
            res.status(500).json({ error });
        }
    },

    resetPassword: async(req, res) => {
        try {
            const findUser = await users.findFirst({
                where: {
                    email : req.body.email}
            })
            if(!findUser){
                return res.render('error')
            }

            const encrypt = await utils.cryptPassword(req.body.email)

            await users.update({
                data:{
                    resetPasswordToken: encrypt,
                },
                where:{
                    id: findUser.id  
                }
            })
            const transporter = nodemailer.createTransport({
                host: "smpt.gmail.com",
                port:465,
                secure:true,
                auth:{
                    user: process.env.EMAIL_USER,
                    password: process.env.PASSWORD_USER
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: req.body.email,
                subject: "RESET PASSWORD",
                html:`<p> Reset Password <a href="localhost:3000/set-password/${encrypt}">Click Here</a </p>`
            }

            transporter.sendMail(mailOptions, (error) => {
                if(error){
                    return res.render('error')
                }
                return res.render('success')
            })

            
        } catch (error) {
            console.log(error)
            res.status(500).json({ error });
        }
    },

    setPassword: async(req, res) => {
        try {
            const findUser = await users.findFirst({
                where: {
                    resetPasswordToken : req.body.key
                }
            })
            if(!findUser){
                return res.render('error')
            }
            await users.update({
                data:{
                    password: await utils.cryptPassword(req.body.password),
                    resetPasswordToken: null
                },
                where:{
                    id: findUser.id  
                }
            })
            return res.render('success')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error });
        }
    }
}