import { Request, Response } from 'express';
import * as departmentsService from '../services/departmentsService';

export const getDepartmentsCount = async (req: Request, res: Response) => {
    try {
        const departmentCount = await departmentsService.getDepartmentsCount();
        // // Debugging
        // console.log(tasks);
        res.json(departmentCount);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};