export const CHANGE_PASSWORD = `
    UPDATE users SET password_hash = $1
    WHERE user_id = $2;
`