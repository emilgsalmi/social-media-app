const express = require('express')
const UserManager = require('../modules/UserManager')
const UserDatabase = require('../modules/UserDatabase')
const mysql = require('mysql2')

const router = express.Router()
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'social_media_db',
    port: 8889
})

const userDatabase = new UserDatabase(db)
const userManager = new UserManager(userDatabase)

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body
    try {
        await userManager.register(username, password, email)
        res.status(201).send('Registration successful')
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const isAuthenticated = await userManager.login(username, password)
        if (isAuthenticated) {
            res.status(200).json({ message: `Welcome, ${username}`, username: username })
        } else {
            res.status(400).json({ error: 'Invalid credentials' })
        }
    } catch (error) {
        console.log('Error during login:', error)
        res.status(400).json({ error: error.message })
    }
})

router.put('/change-password', async (req, res) => {
    const { username, newPassword } = req.body
    try {
        await userManager.changePassword(username, newPassword)
        res.status(200).send('Password updated successfully')
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await userDatabase.getAllUsers()
        res.status(200).json(users)
    } catch (error) {
        console.log('Error fetching users:', error)
        res.status(500).json({ error: 'Error fetching users' })
    }
})

module.exports = router;
