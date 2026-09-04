const express = require('express')
const router = express.Router()
const Task = require('../models/task')



router.post('/tasks', async(req,res)=>{
    const {title,description,status} =req.body
    if(!title|| !description ||!status || !userId){
        return res.status(400).json({error:"All feilds are required"})
    }
    try{
        const newTask = new Task({title,description,status,userId})
        await newTask.save()
        res.status(201).json({message: "Task Added Successfully"})
    }catch(err){
        console.error(err)
        res.status(500).json({error:"Server error, Please try again"})
    }
})
router.get('/tasks', async(req,res)=>{
    try{
        const tasks = await Task.find({})
        if(!tasks){
            return res.status(404).json({error: 'No task found'})
        }
        res.json(tasks)
    }catch(err){
         console.error(err)
        res.status(500).json({error:"Server error, Please try again"})
    }
})
router.get('/tasks/:id', async(req,res)=>{
    try{
        const task = await Task.findById(req.params.id)
        if(!task){
            return res.status(404).json({error:"This task not found"})
        }
        res.json(task)
    }catch(err){
        console.error(err)
        res.status(500).json({error:"Server error, Please try again"})
    }

})
router.put('/tasks/:id', async(req,res)=>{
    try{
        
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new : true}
        )
        if(!updatedTask){
            return res.status(404).json({error:'Task not found'})
        }
        res.json(updatedTask)
    }catch(err){
         console.error(err)
        res.status(500).json({error:"Server error, Please try again"})
    }
})

router.delete('/tasks/:id', async(req,res)=>{
    try{
        const deletedTask = await Task.findByIdAndDelete(req.params.id)
        if(!deletedTask){
            return res.status(404).json({error: 'Task Not found'})
        }
        res.json({message:'Task deleted successfully'})
    }catch(err){
         console.error(err)
        res.status(500).json({error:"Server error, Please try again"})
    }
})

module.exports = router