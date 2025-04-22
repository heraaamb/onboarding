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
export const getEmployeeSpecificTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await taskService.getEmployeeSpecificTasks(req.params.id);
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
        res.status(200).json({"message":"Task created successfully"})
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

export const editTask = async (req: Request, res: Response) => {
    // // Debugging
    // console.log(req.body);
    // console.log(req.params.id);
    try {
        taskService.editTask(req.params.id, req.body)
        res.status(200).json({'message': 'Task edited Successsfully'})
    } catch (error) {
        // // Debugging
        console.log(error);
        res.status(500).json({error: "could not edit task"})
    }
};