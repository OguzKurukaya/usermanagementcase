const repo = require('../repository/userRepository')
const bcrypt = require('bcrypt');
const {sign, verify} = require("jsonwebtoken");
const {responseJson} = require("../../system/service/responder");
const globals = require("../../system/config/consts");
const {createUser} = require("../../user/service/userService");

async function login(username, password) {

    const user = await repo.getUser(username);
    if (!user)
        return false
    if (!await bcrypt.compare(password, user.password)) {
        return false
    }
    // Create token
    // save user token
    const token = createToken(user)
    const refreshToken = createRefreshToken(user)


    // user
    return {
        token: token,
        refreshToken: refreshToken
    };
}

function refreshToken(refreshToken) {

    try {
        const decoded = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = sign({user: decoded.user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
        return {
            token: accessToken,
            user: decoded
        }
    } catch (error) {
        console.log(error)
        return false;
    }
}

async function register(data) {

    let user_id = await createUser(data)

    if (user_id.code !== undefined && user_id.code !== 200) {
        return  responseJson(
            400,
            user_id.data
        )
    }
    // save user token
    const token = createToken({id: user_id , role : globals.DEFAULT_ROLE})
    const refreshToken = createRefreshToken({id:user_id, role: globals.DEFAULT_ROLE})


    return responseJson(
        200,
        {
            token: token,
            refreshToken: refreshToken
        }
    )
}


module.exports = {
    login,
    refreshToken,
    register
}

function createToken(user){
    return sign(
        {user_id: user.id, role :user.role},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "2h",
        }
    )
}

function createRefreshToken(user){
    return sign(
        {user_id: user.id, role:user.role},
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '1d'
        }
    )
}