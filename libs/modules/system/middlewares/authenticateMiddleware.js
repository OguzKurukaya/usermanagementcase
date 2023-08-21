const {verify} = require("jsonwebtoken");
const globals = require("../config/consts");
const {responseJson} = require("../service/responder");

function authenticateUser(req, res, next) {

    const token = req.header("x-auth-token");
    if (!token) return res.status(403).send("Access denied.");
    try {
        req.user = verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (e) {
        return res.status(400).send(
            responseJson(
                400,
                {
                    message: "Invalid token"
                }
            )
        );
    }
    next();
}

async function adminAuth(req, res, next) {

    if (req.user.role !== globals.ADMIN) {
        return res.status(401).json(
            responseJson(
                401,
                {
                    message: "You are not authorized to perform this action"
                }
            )
        ).send()
    }
    next()

}

module.exports = {
    authenticateUser,
    adminAuth
};