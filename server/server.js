const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

let connected = false;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected');
    connected = true;
})
.catch(err => console.log(err));

// sample test route
app.get('/', (req, res) => {
    res.send('Welcome to StreakTracker API');
});

// mongoDB connection check
app.get('/api/db', (req, res) => {
    if (connected) {
        res.send('Connected to MongoDB');
    } else {
        res.send('Not connected to MongoDB');
    }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/streaks', require('./routes/streak'));
app.use('/api/tasks', require('./routes/task'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});