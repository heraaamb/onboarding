import { Request, Response } from 'express';
import * as employeeQueriesService from '../services/employeeQueriesService';

export const getAllEmployeeQueries = async(req:Request, res:Response) => {
    try {
        const queries = await employeeQueriesService.getAllEmployeeQueries()
        // // Debugging
        // console.log(queries); 
        res.json(queries)
    } catch (error) {
        // // Debugging
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch employee queries' });
    }
}
export const getAllOpenEmployeeQueries = async(req:Request, res:Response) => {
    try {
        const queries = await employeeQueriesService.getAllOpenEmployeeQueries()
        // // Debugging
        // console.log(queries); 
        res.json(queries)
    } catch (error) {
        // // Debugging
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch open employee queries' });
    }
}
export const getQueriesByEmpID = async(req:Request, res:Response) => {
    try {
        const queries = await employeeQueriesService.getQueriesByEmpID(req.params.emp_id)
        // // Debugging
        // console.log(queries); 
        res.json(queries)
    } catch (error) {
        // // Debugging
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch employee queries' });
    }
}
export const replyToHelpRequest = async(req:Request, res:Response) => {
    try {
        const queries = await employeeQueriesService.replyToHelpRequest(req.body)
        // // Debugging
        // console.log(queries); 
        res.json(queries)
    } catch (error) {
        // // Debugging
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch employee queries' });
    }
}

export const insertNewQuery = async(req:Request, res:Response) => {
    try {
        const result = await employeeQueriesService.insertNewQuery(req.body)
        // // Debugging
        // console.log(result); 
        res.json(result)
    } catch (error) {
        // // Debugging
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch employee queries' });
    }
}