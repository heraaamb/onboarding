import { Request, Response } from 'express';
import * as usersService from '../services/usersService';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await usersService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
export const getSupervisorsByDepartment = async (req: Request, res: Response) => {
    try {
        // Ensure the department is a string, if it's an array take the first element
        const department = Array.isArray(req.query.department) ? req.query.department[0] : req.query.department;
        
        if (typeof department !== 'string') {
            return res.status(400).json({ error: 'Department name is required and must be a string' });
        }

        // Fetch users from the specified department who are supervisors
        const supervisors = await usersService.getSupervisorsByDepartment(department);
        
        if (supervisors.length === 0) {
            return res.status(404).json({ message: 'No supervisors found for this department' });
        }

        // Respond with the list of supervisors
        res.json(supervisors);
    } catch (err) {
        console.error('Error fetching supervisors by department:', err);
        res.status(500).json({ error: 'Failed to fetch supervisors' });
    }
};



export const createUser = async (req: Request, res: Response) => {
    try {
        // // Debugging
        // console.log(req.body);
        const user = await usersService.createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const updated = await usersService.updateUser(Number(req.params.id), req.body);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        await usersService.deleteUser(Number(req.params.id));
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};