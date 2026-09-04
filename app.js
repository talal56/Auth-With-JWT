require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

const userRoute = require('./routes/userRoute')
const taskRoute = require('./routes/taskRoute')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.static(path.join(__dirname,'public')));

app.use('/api', userRoute);
app.use('/api', taskRoute)

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to Mongo DB");
    app.listen(PORT ,'0.0.0.0', ()=>{
        console.log(`Server runs on http://localhost:${PORT}`)
    })
}).catch((err) => {
    console.log("MongoDB connection error", err)
})
