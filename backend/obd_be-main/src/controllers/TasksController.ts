import { Request, Response } from 'express';
import * as taskService from '../services/tasksService';

export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await taskService.getAllTasks();
        // // Debugging
        // console.log(tasks);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

export const deleteTask = async(req: Request,res: Response) => {
    try {
        await taskService.deleteTask(req.params.id);
        res.json({"status message":"Task Deleted","id": req.params.id}) 
    } catch (error) {
        // // Debugging
        console.log(error);
        res.status(500).json({error: "Failed to remove task"})
    }
}

export const createTask = async(req: Request, res: Response) => {
    try {
        await taskService.createTask(req.body)
        res.send("Task created successfully")
    } catch (error) {
        // // Debugging
        console.log(error);
        res.status(500).json({error: "failed to create the task"})
    }
}

export const updateTaskStatus = async (req: Request, res: Response) => {
    try {
        taskService.updateTaskStatus(req.params.id)
        res.send("Task Status updated Successsfully")
    } catch (error) {
        // // Debugging
        console.log(error);
        res.status(500).json({error: "could not update task"})
    }
};