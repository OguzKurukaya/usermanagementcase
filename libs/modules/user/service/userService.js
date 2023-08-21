const userRepository = require('../repository/userRepository')
const globals = require("../../system/config/consts");
const repo = require("../repository/userRepository");
const {responseJson} = require("../../system/service/responder");
const bcrypt = require("bcrypt");

async function deleteUser(user_id){
    return await userRepository.deleteUser(user_id)
}

async function updateUser(data){
    return await userRepository.updateUser(data)

}

async function getAllUsers(page = 1){
    let offset = (page - 1) * 10
    return await userRepository.getAllUsersWithPagination(offset)
}


async function createUser(data, role = globals.DEFAULT_ROLE) {
    const user = await repo.userExists(data.username);
    if (user)
        return responseJson(
            400,
            {
                message: "User already exists"
            }
        )
    const hashedPassword = await bcrypt.hash(data.password, process.env.SALT_ROUNDS);
    const newUser = {
        username: data.username,
        password: hashedPassword,
        role: role
    }
    const result = await repo.addUser(newUser);
    if (!result) {
        return responseJson(
            500,
            {
                message: "Error creating user"
            }
        )
    }
    return result
}

module.exports = {
    createUser,
     updateUser,
    deleteUser,
    getAllUsers
}