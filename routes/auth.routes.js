const {Router} = require("express");
const bcrypt = require('bcryptjs');
const {check, validationResult} = require("express-validator");
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const config = require("config")
const fs = require('fs');

const router = Router();
//регистрация
router.post('/register',
    [
        check('email', 'Некоректный адрес почты').isEmail(),
        check('password', "Минимальная длинна пароля - 6").isLength({min: 6})
    ],
    async (req, res) =>{
    try {
        const errors = validationResult(req)
        console.log(req.body);
        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некоректные данные регистрации'
            })

        const {email, password} = req.body;
        const candidate = await User.findOne({email})

        if(candidate)
           return  res.status(400).json({message: 'Данный пользователь уже есть'})

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({email, password: hashedPassword});

        await user.save().then(()=>{
            let dir = `./storage/${user._id}`
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir, { recursive: true });
        });


        res.status(201).json({message: "Пользователь создан"})
    } catch (e) {
        res.status(500).json({message: "Что-то пошло не так..."+e});
    }
})

//логин
router.post('/login',
    [
        check('email', 'Некоректный адрес почты').normalizeEmail().isEmail(),
        check('password', "Введите пароль").exists()
    ],
    async (req, res) =>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некоректные данные регистрации'
            });

        const  {email, password} = req.body;

        const user = await User.findOne({email})
        console.log(email)
        if(!user)
            return res.status(400).json({message: "Пользователь не найден"})

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({message: "Неверный пароль"})
        }

        const token = jwt.sign(
            { userId: user.id},
            config.get("jwtSecret"),
            {expiresIn: '24h'}
        )

        res.json({token, userId: user.id})

    } catch (e) {
        res.status(500).json({message: "Что-то пошло не так..."});
    }
})

module.exports = router;