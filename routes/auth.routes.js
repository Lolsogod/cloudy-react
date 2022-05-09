const {Router} = require("express");
const bcrypt = require('bcryptjs');
const {check, validationResult} = require("express-validator");
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const config = require("config")

const router = Router();
// /api/auth/register
router.post('/register',
    [
        check('email', 'Некоректный мейл').isEmail(),
        check('password', "минимальная длинна пароля 6").isLength({min: 6})
    ],
    async (req, res) =>{
    try {
        const errors = validationResult(req)
        console.log(req.body);
        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: 'некоректные данные регистрации'
            })

        const {email, password} = req.body;
        const candidate = await User.findOne({email})

        if(candidate)
           return  res.status(400).json({message: 'Такой мейл уже есть'})

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({email, password: hashedPassword});

        await user.save();

        res.status(201).json({message: "пользователь создан"})
    } catch (e) {
        res.status(500).json({message: "что-то пошло не так..."});
    }
})

// /api/auth/login
router.post('/login',
    [
        check('email', 'Некоректный мейл').normalizeEmail().isEmail(),
        check('password', "введите").exists()
    ],
    async (req, res) =>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: 'некоректные данные регистрации'
            });

        const  {email, password} = req.body;

        const user = await User.findOne({email})

        if(!user)
            return res.status(400).json({message: "пользователь не найден"})

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({message: "неверный пароль"})
        }

        const token = jwt.sign(
            { userId: user.id},
            config.get("jwtSecret"),
            {expiresIn: '24h'}
        )

        res.json({token, userId: user.id})

    } catch (e) {
        res.status(500).json({message: "что-то пошло не так..."});
    }
})

module.exports = router;