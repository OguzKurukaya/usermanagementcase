const con = require('../../system/repository/database');

getUser = function (username) {
    return new Promise(function (resolve, reject) {
            con.query(`SELECT * FROM users WHERE username= '${username}' LIMIT 1`, function (err, rows) {
                if (rows === undefined) {
                    reject(new Error("Error rows is undefined"));
                } else {
                    resolve(rows[0]);
                }
            })
        }
    )
};

userExists  = function (username) {
    return new Promise(function (resolve, reject) {
            con.query(`SELECT count(id) as count FROM users WHERE username = '${username}'`, function (err, rows) {
                if (rows === undefined) {
                    reject(new Error("Error rows is undefined"));
                } else {
                    resolve(rows [0].count)
                }
            })
        }
    )
};

addUser = function (newUser) {
    return new Promise(function (resolve, reject) {
        con.query(`INSERT INTO users (username, password, role) VALUES ('${newUser.username}', '${newUser.password}', '${newUser.role}')`, function (err, rows) {
            if (rows === undefined) {
                reject(new Error("Error rows is undefined"));
            } else {
                resolve(rows.insertId);
            }
        })
    })
};

deleteUser = function (id) {
    return new Promise(function (resolve, reject) {
        con.query(`DELETE FROM users WHERE id = '${id}'`, function (err, rows) {
            if (rows === undefined) {
                reject(new Error("Error rows is undefined"));
            } else {
                resolve(rows.affectedRows);
            }
        })
    })
};

updateUser = function (data) {
    return new Promise(function (resolve, reject) {
        con.query(`UPDATE users SET username = '${data.username}', role = '${data.role}' WHERE id = '${data.user_id}'`, function (err, rows) {
            if (err !== null && err.errno === 1062) {
                resolve({
                    message: "Username already exists"
                });
            }
            if (rows === undefined) {
                reject(new Error("Error rows is undefined"));
            } else {
                resolve({
                    message: "User updated successfully"
                });
            }
        })
    })
}

getAllUsersWithPagination = function (offset, limit = 10) {
    return new Promise(function (resolve, reject) {
        con.query(`SELECT user.id, user.username, user.role FROM users as user LIMIT ${limit} OFFSET ${offset}`, function (err, rows) {
            if (rows === undefined) {
                reject(new Error("Error rows is undefined"));
            } else {
                resolve(rows);
            }
        })
    })
};


module.exports = {
    getUser,
    addUser,
    deleteUser,
    updateUser,
    getAllUsersWithPagination,
    userExists
}