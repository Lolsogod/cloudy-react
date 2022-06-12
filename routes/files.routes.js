const {Router} = require('express');
const File = require('../models/File')
const auth = require('../middleware/auth.middleware')
const router = Router();
const multer = require("multer");
const fs = require('fs');
const User = require("../models/User");

const storage = multer.diskStorage({
    destination: (req,file, cb) => {
        cb(null, `storage\\${req.user.userId}`)
    },
    filename: async (req, file, cb) => {
        file.originalname = await getUniqueName(file.originalname, req.user.userId)
        cb(null, file.originalname)
    }
})

const upload = multer({storage}).single('file');

const getUniqueName = async (origName, userId) =>{
    let splited = origName.split('.')
    let ext = ""
    if (splited.length > 1) ext = splited.pop();
    let tmpName = splited.join('.');
    let c = 0;
    let candidate = await File.findOne({name: tmpName, extension: ext, owner: userId})
    while (candidate){
        c++;
        candidate =  await File.findOne({name: tmpName + `(${c})`,  extension: ext, owner: userId});
    }
    if (c === 0) return `${tmpName}.${ext}`
    return `${tmpName}(${c}).${ext}`

}

const spaceInfo = async (req)=>{
    const usr = await User.findOne({_id: req.user.userId})
    const allFiles = await File.find({owner: req.user.userId})
    const occupied = allFiles.reduce((accumulator, file) =>{
        return accumulator + file.size;
    },0)
    return {occupied, total: usr.space}
}

router.post('/upload', auth, async (req, res) =>{
    try {
        upload(req, res, async (err)=>{
            let space = await spaceInfo(req)
            if(space.occupied + req.file.size <= space.total){
                let splited = req.file.originalname.split('.')
                let extension = ""
                if (splited.length > 1) extension = splited.pop();
                const name = splited.join('.');
                const type = req.file.mimetype
                const path = `storage\\${req.user.userId}\\${req.file.originalname}`
                const size = req.file.size
                //console.log(path)
                const dbFile = new File({
                    name, extension, type, path, size, owner: req.user.userId
                })

                await dbFile.save()
                return res.status(201).send(req.file)
            }
            res.status(500).json({message: "не достаточно места"});
        })
    } catch (e) {
        res.status(500).json({message: e.message});
    }
})

router.put('/share/:id', auth, async (req, res) =>{
    try {
        let file = await  File.findOne({_id: req.params.id});
        await file.updateOne({"shared": !file.shared})
        res.status(200).json({message: "успешно! " + file.shared})
    } catch (e) {
        res.status(500).json({message: "что-то пошло не так...: " + e});
    }
})

router.get('/', auth,async (req, res) =>{
    try {
        const files = await  File.find({owner: req.user.userId})
        //console.log(files)
        res.json(files);
    } catch (e) {
        //console.log(req, req.headers.authorization)
        res.status(500).json({message: "что-то пошло не так..."});
    }
})
router.get('/space/', auth, async (req, res)=>{
    try {
        res.status(200).json(await spaceInfo(req))
    } catch (e) {
        res.status(500).json({message: "что-то пошло не так...: " + e});
    }
})
router.get('/shared/:id', async (req, res) =>{
    try {
        const file = await  File.findOne({_id: req.params.id});
        console.log(file.shared)
        if(file.shared)
            res.download(file.path);
        else
            res.status(401).json({message: "отказано в доступе."})
    } catch (e) {
        res.status(401).json({message: "отказано в доступе.."});
    }
})
router.get('/:id', auth, async (req, res) =>{
    try {
        //console.log(req.params.id)
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
        res.status(500).json({message: "что-то пошло не так...: " + e});
    }
})


module.exports = router;