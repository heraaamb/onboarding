import pool from '../db/db';
import bcrypt from 'bcrypt';
import jwt, {SignOptions} from 'jsonwebtoken';

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export async function checkUserDetails(data: any) {
    // // Debugging
    // console.log("data in auth login service: ", data);
    const result = await pool.query(`
        SELECT u.user_id, u.password_hash, u.role, u.email, e.emp_id
        FROM users u
        JOIN employees e ON u.user_id = e.user_id
        WHERE u.email = $1`, [data.email]);
    console.log(result);
    if (result.rows.length === 0) {
      return { passwordCheckResult: false };
    }
  
    const { password_hash, role, id: user_id, email, emp_id } = result.rows[0];
    const passwordCheckResult = await bcrypt.compare(data.password, password_hash);
  
    if (!passwordCheckResult) {
      return { passwordCheckResult: false };
    }
  
    const payload = { id: user_id, email, role, emp_id};
    const signOptions: SignOptions = {
      expiresIn: parseInt(JWT_EXPIRES_IN || '3600', 10), // Default to 1 hour if not set
    //   algorithm: 'HS256' // Specify the algorithm
    };
  
    const token = jwt.sign(payload, JWT_SECRET, signOptions);
  
    return {
      passwordCheckResult: true,
      token,
      user: { id: user_id, email, role, emp_id }
    };
  }
