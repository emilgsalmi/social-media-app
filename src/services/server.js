const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const userRoutes = require('../services/userRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'../../public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'index.html'))
})


// Använd userRoutes
app.use('/', userRoutes);

// Starta server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
