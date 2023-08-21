const globals = require('../../system/config/consts');
const {responseJson} = require("../../system/service/responder");
const {isInt} = require("validator");
const service = require("../service/userService");
const {registerValidator} = require("./authenticateController");

async function deleteUser(req, res) {
    if (req.user.role !== globals.ADMIN) {
        res.status(401).json(
            responseJson(
                401,
                {
                    message: "You are not authorized to perform this action"
                }
            )
        ).send()
        return
    }

    if (!validateDeleteUser(req, res)) {
        return
    }

    let result = await service.deleteUser(req.body.user_id)

    if (!result) {
        res.status(200).json(
            responseJson(
                200,
                {
                    message: "User not found"
                }
            )
        ).send()
        return
    }

    return res.status(200).json(
        responseJson(
            200,
            {
                message: "User deleted successfully"
            }
        )
    ).send();

}

async function updateUser(req, res) {

    if (!validateUpdateUserRole(req, res)) {
        return
    }

    let data = {
        user_id : req.body.user_id,
        username: req.body.username,
        role: req.body.role
    }
    let result = await service.updateUser(data)

    if (!result) {
        return res.status(200).json(
            responseJson(
                200,
                result
            )
        ).send()

    }

    return res.status(200).json(
        responseJson(
            200,
            result
        )
    ).send();
}

async function getUsers(req, res) {
    let page = req.body.page ? req.body.page : 1

    let result = await service.getAllUsers(page)
    if (!result) {
        res.status(400).json(
            responseJson(
                400,
                {
                    message: "An error occurred while fetching users"
                }
            )
        ).send()
        return
    }

    res.status(200).json(
        responseJson(
            200,
            {
                message: "Users fetched successfully",
                users: result
            }
        )
    ).send()
}

async function createUser(req, res) {
    if (!validateCreateUser(req, res)) return

    let data = {
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
    }
    let result = await service.createUser(data)

    if (result.code !== undefined && result.code !== 200) {
        return res.status(400).json(
            result
        )
    }
    return res.status(200).json(
        responseJson(
            200,
            {
                message: "User created successfully"
            }
        )
    ).send();

}


module.exports = {
    deleteUser,
    updateUser,
    getUsers,
    createUser
}

function validateCreateUser(req, res) {
    if (!registerValidator(req, res))
        return false

    if (req.body.role === undefined || globals.ROLES.includes(req.body.role) === false) {
        req.body.role = globals.DEFAULT_ROLE
    }
    return true
}

function validateDeleteUser(req, res) {
    if (req.body.user_id === undefined) {
        res.status(400).json(
            responseJson(
                400,
                {
                    message: "user_id is required"
                }
            )
        ).send()
        return false
    }

    if (isInt(req.body.user_id) === false) {
        res.status(400).json(
            responseJson(
                400,
                {
                    message: "user_id must be an integer"
                }
            )
        ).send()
        return false
    }
    return true
}

function validateUpdateUserRole(req, res) {

    if (!validateDeleteUser(req, res)) {
        return false
    }
    if (req.body.role === undefined) {
        res.status(400).json(
            responseJson(
                400,
                {
                    message: "role is required"
                }
            )
        ).send()
        return false
    }

    if (isInt(req.body.role) === false) {
        res.status(400).json(
            responseJson(
                400,
                {
                    message: "role must be an integer"
                }
            )
        ).send()
        return false
    }

    if (req.body.username === undefined) {
        res.status(400).json(
            responseJson(
                400,
                {
                    message: "username is required"
                }
            )
        ).send()
        return false
    }

    return true
}