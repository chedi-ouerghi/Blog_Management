require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

connectDB();

app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use(cors());

app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
