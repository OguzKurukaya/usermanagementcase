require('dotenv').config();

const express = require('express');
const app = express();

const {urlencoded} = require("express");
app.use(urlencoded({
    extended: true
}));
app.use(express.json());


const cookieParser = require('cookie-parser')
app.use(cookieParser())

const usersRouter = require('./libs/modules/user/routes/userRoutes.js')
app.use('/users', usersRouter)



app.listen(3000, () => {
    console.log('Server is listening on port 3000')
})







app.post('/login', (req,res) => {
    // Authenticate User
    const username = req.body.username;
    const user = { name: username }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

    res.json({
        access : process.env.ACCESS_TOKEN_SECRET
    })
})
