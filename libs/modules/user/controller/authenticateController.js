const services = require('../service/authenticateService')
const {responseJson} = require("../../system/service/responder");

async function login(req, res) {
    if (!loginValidator(req, res)) {
        return;
    }
    const result = await services.login(req.body.username, req.body.password);
    if (!result) {
        res.status(400).json(
            responseJson(401, {
                message: 'Invalid Password or Username'
            })
        ).send()
        return
    }
    res.status(200)
        .cookie('refreshToken', result.refreshToken, {httpOnly: true, sameSite: 'strict'})
        .json(
            responseJson(200, {
                    token: result.token,
                }
            )
        )
    return res.send()
}

async function refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).send('Access Denied. No refresh token provided.');
    }
    const result = services.refreshToken(refreshToken)
    console.log(result)
    if (!result) {
        res.status(400).json(
            responseJson(401, {
                message: 'Invalid Refresh Token'
            })
        ).send()
        return
    }

    res.status(200)
        .json(
            responseJson(200, {
                token: result.token
            })
        )
}

async function register(req, res) {
    if (!registerValidator(req, res)) {
        return;
    }

    const data = {
        username: req.body.username,
        password: req.body.password
    }
    const result = await services.register(data)
    if (result.code !== 200) {
        res.status(400)
        res.json(
            result
        )
        return
    }
    res
        .cookie('refreshToken', result.data.refreshToken, {httpOnly: true, sameSite: 'strict'})
        .json(
            responseJson(200, {
                    token: result.data.token,
                }
            )
        )
    return res.send()

}

async function logout(req, res){
    res.clearCookie('refreshToken')
        .json(
            responseJson(200, {
                   message : 'logout success',
                }
            )
        )
    return res.send()
}

function loginValidator(req, res) {
    if (req.body.username === undefined) {
        res.json(
            responseJson(401, {
                message: 'username empty'
            })
        )
        res.send()
        return false
    }

    if (req.body.password === undefined) {
        res.json(
            responseJson(401, {
                message: 'password empty'
            })
        )
        res.send()
        return false
    }
    return true

}

function registerValidator(req, res) {

    if (req.body.username === undefined || req.body.username.length < 4 || req.body.username.length > 15) {
        res.json(
            responseJson(401, {
                message: 'username invalid. 4 < length < 15'
            })
        )
        res.send()
        return false
    }

    if (req.body.password === undefined || req.body.password.length < 5 || req.body.username.length > 20) {
        res.json(
            responseJson(401, {
                message: 'password invalid. 5 < length < 20'
            })
        )
        res.send()
        return false
    }

    return true

}


module.exports = {
    login,
    refreshToken,
    register,
    registerValidator,
    logout
}
