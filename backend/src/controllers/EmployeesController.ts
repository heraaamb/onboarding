import { Request, Response } from 'express';
import * as employeeService from '../services/employeesService';

export const getEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await employeeService.getAllEmployees();
        // // Debugging
        // console.log(employees);
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

export const getOnboardingEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await employeeService.getOnboardingEmployees();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

export const createEmployee = async (req: Request, res: Response) => {
    try {
        // // Debugging
        console.log("req body: ",req.body);
        const employee = await employeeService.createEmployee(req.body);
        res.status(201).json(employee);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

export const updateEmployee = async (req: Request, res: Response) => {
    
        // // Debugging
        console.log(req.body);
        // console.log(req.params.id);

    try {
        const updated = await employeeService.updateEmployee(Number(req.params.id), req.body);
        res.json(updated);
    } catch (err) {
        // // Debugging
        console.log(err);
        res.status(500).json({ error: err });
    }
}

export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        await employeeService.deleteEmployee(Number(req.params.id));
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: `Failed to delete employee: ${err}` });
    }
};

export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const employee = await employeeService.getEmployeeById(Number(req.params.id));
        // // Debugging
        console.log(employee);
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};