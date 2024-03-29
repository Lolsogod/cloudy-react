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
        file.originalname = await getUniqueName(file.originalname, req.user.userId, req.headers.current)
        cb(null, file.originalname)
    }
})

const upload = multer({storage}).single('file');

const getUniqueName = async (origName, userId, folder) =>{
    let splited = origName.split('.')
    let ext = ""
    if (splited.length > 1) ext = splited.pop();
    let tmpName = splited.join('.');
    let c = 0;
    let candidate = await File.findOne(
        {name: tmpName, extension: ext,
            owner: userId, parent: folder=="null"?null:folder})
    while (candidate){
        c++;
        candidate =  await File.findOne(
            {name: tmpName + `(${c})`, extension: ext,
                owner: userId, parent: folder=="null"?null:folder});
    }
    if (c === 0) return `${folder}.${tmpName}.${ext}`
    return `${folder}.${tmpName}(${c}).${ext}`

}

const cascadeDelete = async (id) =>{
    const file = await  File.findOne({_id: id});
    if(file.type === "folder" ){
        let contains = await File.find({parent: file})
        contains.forEach(f=>{cascadeDelete(f)})
    }else
        fs.unlinkSync(file.path)
    await file.deleteOne()

}

const spaceInfo = async (req)=>{
    const usr = await User.findOne({_id: req.user.userId})
    const allFiles = await File.find({owner: req.user.userId})
    const occupied = allFiles.reduce((accumulator, file) =>{
        return accumulator + file.size;
    },0)
    return {occupied, total: usr.space}
}
/**
 * @swagger
 * components:
 *  securitySchemes:
 *      BearerAuth:
 *          type: http
 *          scheme: bearer
 *  schemas:
 *      File:
 *          type: object
 *          required:
 *              - name
 *              - type
 *              - path
 *              - size
 *              - shared
 *          properties:
 *              name:
 *                  type: string
 *                  description: name of the file
 *              type: 
 *                  type: string
 *                  description: type of file
 *              path:
 *                  type: string
 *                  description: path to the file
 *              size:
 *                  type: number
 *                  description: size of the file
 *              shared:
 *                  type: boolean
 *                  description: is file shared
 *              extension:
 *                  type: string
 *                  description: file extension 
 *              date:
 *                  type: date
 *                  description: date of uploading 
 *              owner:
 *                  type: string
 *                  description: id of file owner
 *              parrent:
 *                  type: string
 *                  description: id of directory
 *              _id:
 *                  type: string
 *                  description: file id 
 *          example:
 *              date: "2022-10-21T17:47:34.264Z"
 *              extension: "pdf"
 *              name: "BOOK"
 *              owner: "6352db5c66d5de528dc803ce"
 *              parent: null
 *              path: "storage\\6352db5c66d5de528dc803ce\\null.book.pdf"
 *              shared: false
 *              size: 253316
 *              type: "application/pdf"
 *              __v: 0
 *              _id: "6352db6a66d5de528dc803d9"
 *      Folder:
 *          type: object
 *          required:
 *              - name
 *              - parrent
 *          properties:
 *              name:
 *                  type: string
 *                  description: name of the file
 *              parrent:
 *                  type: string
 *                  description: id of directory
 *          example:
 *              name: "test-folder"
 *              parrent: null
 */

/**
 * @swagger
 * tags: 
 *  name: Files
 *  description: The files mangaing API 
 */

/**
 * @swagger
 * /api/files:
 *  get:
 *      security: 
 *        - BearerAuth: []
 *      summary: Returns the list of all files
 *      tags: [Files]
 *      responses: 
 *          304:
 *              description: The list of the files
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items: 
 *                              $ref: '#/components/schemas/File'
 */
//список файлов
router.get('/', auth,async (req, res) =>{
    try {
        let files = await  File.find({owner: req.user.userId, parent: req.query.folderId})
        res.json(files);
    } catch (e) {
        res.status(500).json({message: "что-то пошло не так..."});
    }
})

/**
 * @swagger
 * /api/files/info/{id}:
 *  get:
 *      security: 
 *        - BearerAuth: []
 *      summary: Get file by id
 *      tags: [Files]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema: 
 *              type: string
 *          required: true
 *      responses: 
 *          304:
 *              description: The file info by id
 *              content:
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/File'
 */
//информация о файле/папке
router.get('/info/:id', auth, async (req, res) =>{
    try {
        const file = await  File.findOne({_id: req.params.id});
        res.json(file)
    } catch (e) {
        //костыль
        res.json({_id: null})
    }
})

/**
 * @swagger
 * /api/files/new-folder:
 *  post:
 *      security: 
 *        - BearerAuth: []
 *      summary: Create new folder
 *      tags: [Files]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                       $ref: '#/components/schemas/Folder'
 *      resoinses:
 *          200:
 *              description: The folder was created succesfully
 *          500: 
 *              description: folder creation failed
 */
//создание папки
router.post('/new-folder', auth, async (req, res) =>{
    try {
        let name = (await getUniqueName(req.body.name, req.user.userId, req.body.parent)).split('.')
        name.shift()
        name.pop()
        const folder = new File({
            name: name.join('.'), extension: "", type: "folder",
            path: `storage\\${req.user.userId}`, size: 0, owner: req.user.userId,
            parent: req.body.parent
        })
        await folder.save()
        res.status(200).json({message: "created"});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
})
//загрузка файла
router.post('/upload', auth, async (req, res) =>{
    try {
        upload(req, res, async ()=>{
            let space = await spaceInfo(req)
            if(space.occupied + req.file.size <= space.total){
                let splited = req.file.originalname.split('.')
                let extension = ""
                if (splited.length > 2) extension = splited.pop();
                let folder = splited.shift()
                const parent = folder=="null"?null:folder;
                const name = splited.join('.');
                const type = req.file.mimetype
                const path = `storage\\${req.user.userId}\\${req.file.originalname}`
                const size = req.file.size
                const dbFile = new File({
                    name, extension, type, path, size, owner: req.user.userId, parent
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
//открыть доступ к файлу
router.put('/share/:id', auth, async (req, res) =>{
    try {
        let file = await  File.findOne({_id: req.params.id});
        await file.updateOne({"shared": !file.shared})
        res.status(200).json({message: "успешно! " + file.shared})
    } catch (e) {
        res.status(500).json({message: "что-то пошло не так...: " + e});
    }
})

//информация о хранилищк
router.get('/space/', auth, async (req, res)=>{
    try {
        res.status(200).json(await spaceInfo(req))
    } catch (e) {
        res.status(500).json({message: "что-то пошло не так...: " + e});
    }
})
//скачть файл по ссылке
router.get('/shared/:id', async (req, res) =>{
    try {
        const file = await  File.findOne({_id: req.params.id});

        if(file.shared)
            res.download(file.path, `${file.name}${file.extension?("." + file.extension):""}`);
        else
            res.status(401).json({message: "отказано в доступе."})
    } catch (e) {
        res.status(401).json({message: "отказано в доступе.."});
    }
})
//скачать файл
router.get('/:id', auth, async (req, res) =>{
    try {
        const file = await  File.find({_id: req.params.id});
        res.download(file[0].path);
    } catch (e) {
        res.status(500).json({message: "что-то пошло не так..."});
    }
})
//удалить файл
router.delete('/delete/:id', auth, async (req, res) =>{
    try {
        await cascadeDelete(req.params.id)
        res.status(204).json({message: "успешно удалён"})
    } catch (e) {
        res.status(500).json({message: "что-то пошло не так...: " + e});
    }
})

module.exports = router;