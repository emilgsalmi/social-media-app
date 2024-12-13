const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const userRoutes = require('../services/userRoutes')
const port = 3000

const app = express()

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname,'../../public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'index.html'))
})

app.use('/', userRoutes)

app.listen(port, () => {
    console.log('Server running on http://localhost:3000')
})
