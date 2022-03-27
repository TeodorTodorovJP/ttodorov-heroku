import pool from './pool.js';


const deleteUser = async (userId) => {
  const sql = `
    UPDATE users
    SET is_deleted = 1 
    WHERE (user_id = ?);
    `;
  try {
    await pool.query(sql, [userId]);
  } catch (error) {
    return { message: 'Something went wrong with delete user request.' };
  }
};

const activateUser = async (userId) => {
  const sql = `
    UPDATE users
    SET is_deleted = 0 
    WHERE (user_id = ?);
    `;
  try {
    await pool.query(sql, [userId]);
  } catch (error) {
    return { message: 'Something went wrong with activateUser request.' };
  }
};

const ban = async (userId, days) => {
  const sql = `
    UPDATE users
    SET is_banned = ? 
    WHERE (id = ?)
    `;
  try {
    await pool.query(sql, [days, userId]);
  } catch (error) {
    return { message: 'Something went wrong with ban user request.' };
  }
};

const liftBan = async (userId) => {
  const sql = `
    UPDATE users
    SET is_banned = NULL
    WHERE (id = ?)
    `;
  try {
    await pool.query(sql, [userId]);
  } catch (error) {
    return { message: 'Something went wrong with lift ban request.' };
  }
};

const getUserWithRole = async (uniqueUserName) => {
  const sql = `
  SELECT u.user_id as id, u.unique_user_name as uniqueUserName, r.role_name as role
  FROM users u
  JOIN users_roles r ON u.role_Id = r.role_id
  WHERE u.unique_user_name = ?
    `;
  let result = [];
  try {
    result = await pool.query(sql, [uniqueUserName]);
  } catch (err) {
    return { error: 'Something went wrong with getUserWithRole request.' };
  }

  return result[0];
};

const getUserData = async (uniqueUserName) => {
  const sql = `
  SELECT  u.user_id as userId, u.unique_user_name as uniqueUserName, u.user_name as userName, u.role_id as roleId, u.is_banned as isBanned, u.is_deleted as isDeleted, r.role_name as roleName
  FROM users u
  JOIN users_roles r ON u.role_Id = r.role_id
  WHERE u.unique_user_name = ?
    `;
  let result = [];
  try {
    result = await pool.query(sql, [uniqueUserName]);
  } catch (err) {
    console.log(err)
    return { error: 'Something went wrong with getUserData request.' };
  }

  return result[0];
};

export default {
  deleteUser,
  activateUser,
  ban,
  liftBan,
  getUserWithRole,
  getUserData
};
