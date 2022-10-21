const express = require('express');
const config = require('config')
const mongoose = require("mongoose");
const  app = express();
const path = require("path")
const cors = require("cors");

const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")

const options = {
    apis: ["./routes/*.js"],
    definition:{
        openapi: "3.0.3",
        info:{
            title: "Cloudy API",
            versiom: "1.0.0",
            description: "Api for Cloudy cloud storage"
        }, 
        servers:[
            {
                url: "http://localhost:5000"
            }
        ]
    }
}

const specs = swaggerJsDoc(options)

app.use(cors());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))
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