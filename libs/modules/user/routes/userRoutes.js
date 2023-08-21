const express = require('express')
const router = express.Router()

const authenticateController = require('../controller/authenticateController')
const authenticateMiddleware = require('../../system/middlewares/authenticateMiddleware')
const usersController = require('../controller/userController')

router.post('/login', authenticateController.login)
router.post('/token/refresh', authenticateController.refreshToken)
router.post('/register', authenticateController.register)
router.post('/logout', authenticateController.logout)


router.get('/getUsers', authenticateMiddleware.authenticateUser, usersController.getUsers)


router.delete('/', [authenticateMiddleware.authenticateUser, authenticateMiddleware.adminAuth], usersController.deleteUser)
router.patch('/update',[authenticateMiddleware.authenticateUser, authenticateMiddleware.adminAuth], usersController.updateUser)
router.post('/createUser', [authenticateMiddleware.authenticateUser, authenticateMiddleware.adminAuth], usersController.createUser)

module.exports = router