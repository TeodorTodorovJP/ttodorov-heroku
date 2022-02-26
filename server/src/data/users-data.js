import pool from './pool.js';
import { searchPlayList } from '../common/searchPlayList.js';

const create = async (username, password, role) => {
  // const sql = `
  //   INSERT INTO users(username, password, roles_id)
  //   VALUES (?,?,(SELECT id FROM roles WHERE name = ?))
  //   `;

  const sql =  `select create_user(?, ?, ?, ?, ?, ?);`
  let result = {};

  try {
    result = await pool.query(sql, [username, password, role]);
  } catch (error) {
    return { message: 'Something went wrong with create user request.' };
  }

  return {
    id: result.insertId,
    username: username,
  };
};

const getBy = async (column, value) => {
  const sql = `
    SELECT id, username
    FROM users
    WHERE ${column} = ?
    `;
  let result = [];
  try {
    result = await pool.query(sql, [value]);
  } catch (err) {
    return { error: 'Something went wrong with getBy request.' };
  }


  return result[0];
};

const getWithRole = async (username) => {
  const sql = `
    SELECT u.id, u.username, u.password, r.name as role
    FROM users u
    JOIN roles r ON u.roles_Id = r.id
    WHERE u.username = ? 
    `;
  let result = [];
  try {
    result = await pool.query(sql, [username]);
  } catch (err) {
    return { error: 'Something went wrong with getWithRole request.' };
  }

  return result[0];
};

const getUserInfo = async (id) => {
  const sql = `
    SELECT id, username, profile_pic
    FROM users
    WHERE id = ?
    `;
  let result = [];
  result = await pool.query(sql, [id]);
  try {
  } catch (err) {
    return { error: 'Something went wrong with get user info request.' };
  }

  return result;
};
const logout = async (token) => {
  const sql = `
    INSERT INTO deactivated_tokens (token) VALUES (?)
    `;
  try {
    await pool.query(sql, [token]);
  } catch (err) {
    return { error: 'Something went wrong with logout request.' };
  }
};

const isTokenDeactivated = async (token) => {
  const sql = `
    SELECT * FROM deactivated_tokens t WHERE t.token = ?
    `;
  let result = [];
  try {
    result = await pool.query(sql, [token]);
  } catch (error) {
    return { error: 'Something went wrong with token validating request.' };
  }


  return result[0] === undefined;
};

const updateAvatar = async (userId, file) => {
  const sql = `
    UPDATE users
    SET profile_pic = ? 
    WHERE (id = ?);
    `;
  try {
    await pool.query(sql, [file, userId]);
  } catch (error) {
    return { error: 'Something went wrong with update avatar request.' };
  }

  return file;
};

const getStatusById = async (userId) => {
  const sql = `
    SELECT is_banned, is_deleted
    FROM users
    WHERE id = ?
    `;

  try {
    const result = await pool.query(sql, [userId]);
    return result;
  } catch (error) {
    return { error: 'Something went wrong with get ban status request.' };
  }

};










const addPermissionsForPage = async (pageName, pagePermissions) => {
  //CALL add_permissions_for_page('todo', 'test1,test2,test3');
  const sql = `
      CALL add_permissions_for_page(?, ?);
    `;

  try {
    const result = await pool.query(sql, [pageName, pagePermissions]);
    return result;
  } catch (error) {
    return { error: 'Something went wrong with get ban status request.' };
  }

};

const updatePermissionsForPageForUser = async (pageName, user_id, main_permission, columns, column_values) => {
  // page_name
  // user_id
  // main_permission - block/allow the selected page
  // string with all rows
  // string with value for each corresponding row
  //CALL update_permissions_for_page('todo', 3, 1, 'test1,test2,test3', '1,0,1');
  const sql = `
        CALL update_permissions_for_page_for_user(?, ?, ?, ?, ?);
    `;

  try {
    const result = await pool.query(sql, [pageName, user_id, main_permission, columns, column_values]);
    return result;
  } catch (error) {
    return { error: 'Something went wrong with get ban status request.' };
  }

};

const createMyUser = async (unique_user_name, user_name, user_password, is_banned, is_deleted, profile_pic) => {
  // For create_or_update_user
  //   unique_user_name   varchar(255), 
  //   user_name          varchar(50), 
  //   user_password      varchar(255), 
  //   is_banned          tinyint(1), 
  //   is_deleted         tinyint(1), 
  //   profile_pic        varchar(255)

  const sql =  `select create_user(?, ?, ?, ?, ?, ?) as user;`
  //add_or_create_permissions_for_page
  let result = {};

  try {
    result = await pool.query(sql, [unique_user_name, user_name, user_password, is_banned, is_deleted, profile_pic]);
  } catch (error) {
    console.log(error)
    return { error: 'Something went wrong with createMyUser request.' };
  }

  return {
    id: result[0].user
  };
};


const updateUser = async (user_id, unique_user_name, user_name, user_password, is_banned, is_deleted, profile_pic) => {
  // For update_user
  //   user_id            int(11)
  //   unique_user_name   varchar(255)
  //   user_name          varchar(50)
  //   user_password      varchar(255)
  //   is_banned          tinyint(1)
  //   is_deleted         tinyint(1)
  //   profile_pic        varchar(255)

  // select update_user(7, 'Teodor5', 'Teodor1', 'Teodor1', 0, 0, 'picture') as user;

  const sql =  `select update_user(?, ?, ?, ?, ?, ?, ?) as user;`
  //add_or_create_permissions_for_page
  let result = {};

  try {
    result = await pool.query(sql, [user_id, unique_user_name, user_name, user_password, is_banned, is_deleted, profile_pic]);
  } catch (error) {
    console.log(error)
    return { error: 'Something went wrong with createMyUser request.' };
  }

  return {
    id: result[0].user
  };
};


export default {
  create,
  getWithRole,
  getBy,
  getUserInfo,
  logout,
  isTokenDeactivated,
  updateAvatar,
  getStatusById,
  createMyUser
};
