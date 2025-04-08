export const GET_ALL_USERS = `
  SELECT * FROM users;
`;

export const CREATE_USER = `
  INSERT INTO users (
    name, email, password_hash, role, department_id, status
  ) VALUES (
    $1, $2, $3, $4, $5, $6
  ) RETURNING *;
`;

export const USER_INSERT_QUERY = `
  INSERT INTO users (name, email, password_hash, role, department_id, status)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING user_id;
`;

export const UPDATE_USER = `
  UPDATE users
  SET name = $1,
      email = $2,
      password_hash = $3,
      role = $4,
      department_id = $5,
      status = $6
  WHERE user_id = $7
  RETURNING *;
`;

export const DELETE_USER = `
  DELETE FROM users WHERE user_id = $1;
`;