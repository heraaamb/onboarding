import jwt from 'jsonwebtoken';

export const decodeToken = (token:any) => {
  try {
    const decoded = jwt.decode(token); // Decodes the token without verifying
    return decoded; // Return decoded payload
  } catch (err) {
    throw new Error('Failed to decode token');
  }
};
