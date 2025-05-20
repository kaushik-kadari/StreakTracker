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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/streak-tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// sample test route
app.get('/', (req, res) => {
    res.send('Welcome to StreakTracker API');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/streaks', require('./routes/streak'));
app.use('/api/tasks', require('./routes/task'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});