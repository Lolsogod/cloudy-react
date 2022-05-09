const {Router} = require('express');
const File = require('../models/File')
const auth = require('../middleware/auth.middleware')
const router = Router();
const config = require("config")
const multer = require("multer");
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req,file, cb) => {
        cb(null, 'storage')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage}).single('file');

router.post('/upload', auth, async (req, res) =>{
    try {
        upload(req, res, async (err)=>{
            const name = req.file.originalname.split('.')[0]
            const extension = req.file.originalname.split('.')[1]
            const type = req.file.mimetype
            const path = req.file.path
            const size = req.file.size

            const dbFile = new File({
                name, extension, type, path, size, owner: req.user.userId
            })

            await dbFile.save()
            console.log(req.file, dbFile)
            return res.status(201).send(req.file)
        })
    } catch (e) {
        res.status(500).json({message: "что-то пошло не так..."});
    }
})

router.get('/', auth,async (req, res) =>{
    try {
        const files = await  File.find({owner: req.user.userId})
        console.log(files)
        res.json(files);
    } catch (e) {
        console.log(req, req.headers.authorization)
        res.status(500).json({message: "что-то пошло не так..."});
    }
})

router.get('/:id', auth, async (req, res) =>{
    try {
        console.log(req.params.id)
        const file = await  File.find({_id: req.params.id});
        res.download(file[0].path);
    } catch (e) {
        res.status(500).json({message: "что-то пошло не так..."});
    }
})

router.delete('/delete/:id', auth, async (req, res) =>{
    try {
        const file = await  File.find({_id: req.params.id});
        fs.unlinkSync(file[0].path)
        await  File.deleteOne({_id: req.params.id});

        res.status(204).json({message: "успешно удалён"})
    } catch (e) {
        console.log("here")
        res.status(500).json({message: "что-то пошло не так...: " + e});
    }
})

module.exports = router;