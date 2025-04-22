import { stat } from 'fs';
import pool from '../db/db';
import bcrypt from 'bcrypt'

export async function checkUserDetails(data: any){
    // // Debugging
    console.log("data recieved in auth login service: ",data);
    
    const password_result = await pool.query(`SELECT password_hash,role FROM users WHERE email=$1`,[data.email])
    // // Debugging
    // console.log(password_result);
    const password_hash = password_result.rows[0].password_hash
    const role = password_result.rows[0].role

    const passwordCheckResult = await bcrypt.compare(data.password,password_hash)
    // // Debugging
    console.log("result from service: ",passwordCheckResult);

    return {passwordCheckResult, role};
}