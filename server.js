const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended: false}))

let url = 'mongodb+srv://ankit:8090730652@cluster0.abc7i.mongodb.net/Exercise?retryWrites=true&w=majority';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(cors())

app.use(express.static("public"))
app.get("/", (req,res) => {
    res.sendFile(__dirname+"/views/index.html")
});

app.listen(process.env.PORT || 3000 , () => {
    console.log("Server is listening on port " )
});

let exerciseSessionSchema = new mongoose.Schema({
    description: {type: String, required: true},
    duration: {type: Number, required: true},
    date: String
})

let userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    log: [exerciseSessionSchema]
})

let exercixeSchema = mongoose.model("Session", exerciseSessionSchema)
let user = mongoose.model("user", userSchema)

app.post('/api/exercise/new-user', (req,res)=> {
    let newUser = new user({username: req.body.username})
    newUser.save((error, savedUser) =>{
        if(!error){
            let responseObject ={}
            responseObject['username'] = savedUser.username
            responseObject['id'] = savedUser.id
            res.json(responseObject)
        }
    })
})

app.get("/api/exercise/users", (request , response) =>{
    user.find({}, (error , arrayoFUsers) =>{
        if(!error){
            response.json(arrayoFUsers)
        }
    })
})

app.post("/api/exercise/add", (request, response) =>{
    let newSession = new Session({
        description: request.body.description,
        duration: pareInt(request.body.duration),
        date: request.body.date
    })
    if(newSession.date === ''){
        newSession.date = new Date().toISOString().substring(0,10)
    }
    User.findByIdAndUpdate(
        request.body.userId,
        {$push: {log: newSession}},
        {new : true},
        (error, updateUser) => {
            let responseObject = {}
            responseObject['_id'] = updateUser.id
            responseObject["username"] = updateUser.username
            responseObject["date"] = new Date(newSession.date).toDateString()
            responseObject["description"] = newSession.description
            responseObject['duration'] = newSession.duration
            response.json(responseObject)
        }
    )
})

app.get("/api/exercise/log", (request, response) => {
    User.findById(request.body.userId, (error, result) => {
        if(!error){
            let resposeObject = result
            
            if(request.query.from || request.query.to){
                let fromDate = new Date(0)
                let toDate = new Date()
                if(request.query.from){
                    fromDate = new Date(request.query.from)
                }
                if(request.query.to){
                    toDate = new Date(request.query.to)
                }
                fromDate = fromDate.getTime()
                toDate = toDate.getTime()
                responseObject.log = responseobject.log.filter((session) =>{
                    let sessionDate = new Date(sessionDate).getTime()
                    return sessionDate >= fromDate && sessionDate <= toDate
                })
            }
            if(request.query.limit){
                responseObject.log = responseObject.log.slice(0, request.query.limit)
            }

            response.resposeObject['count'] = result.log.length
            response.json(responseObject)
        }
    })
})

