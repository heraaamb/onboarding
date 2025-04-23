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
        // console.log("req body: ",req.body);
        const employee = await employeeService.createEmployee(req.body);
        res.status(201).json(employee);
    } catch (err: any) {
        console.log(err.detail);
        res.status(500).json({ error: err.detail });
    }
};

export const updateEmployee = async (req: Request, res: Response) => {
    
        // // Debugging
        // console.log(req.body);
        // console.log(req.params.id);

    try {
        const updated = await employeeService.updateEmployee(Number(req.params.id), req.body);
        res.json(updated);
    } catch (err: any) {
        // // Debugging
        console.log(err.detail);
        res.status(500).json({ error: err.detail });
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

export const getEmployeesByDeptId = async (req: Request, res: Response) => {
    try {
        console.log("request params: ",req.params);
        const employees = await employeeService.getEmployeesByDeptId(req.params.dept_id);
        // // Debugging
        console.log(employees);
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};