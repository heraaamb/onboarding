import { Request, Response } from 'express';
import * as authLoginService from '../services/authLoginService';
import { resourceUsage } from 'process';

export async function checkUserDetails(req:Request, res: Response){
    try {
        // // Debugging
        console.log("req body auth login: ",req.body);

        const result = await authLoginService.checkUserDetails(req.body);
        // // Debugging
        console.log("result from controller auth login : ",result);

        res.json(result)
    } catch (error) {
        res.json({error: error})
    }
}