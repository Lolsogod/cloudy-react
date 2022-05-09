const express = require('express');
const config = require('config')
const mongoose = require("mongoose");
const  app = express();
const path = require("path")
const cors = require("cors");


app.use(cors());
app.use(express.json({extended: true}))
app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/files", require("./routes/files.routes"))

if (process.env.NODE_ENV === 'production'){
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.get('port')

async function start(){
    try{
        await mongoose.connect(config.get("mongoUrl"),{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        app.listen(PORT, () =>console.log(`deployed on ${PORT}`));
    }catch (e){
        console.log("Server error", e.message);
        process.exit(1);
    }
}

start();