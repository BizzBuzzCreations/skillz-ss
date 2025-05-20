// require('dotenv').config();
// const express = require('express');
// const connectDB = require('./config/db');
// const cors = require('cors');
// const { protect } = require('./middleware/authMiddleware');

// const app = express();
// connectDB();

// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', require('./routes/authRoutes'));

// app.get('/', (req, res) => {
//   res.send('API is running...');
// })

// app.get('/admin', (req, res) => {
//   res.send('Admin route');
// })

// app.get('/admin-dashboard', protect(['admin']), (req, res) => {
//   res.json({ message: `Welcome Admin ${req.user.userId}` });
// });

// app.get('/instructor-dashboard', protect(['instructor', 'admin']), (req, res) => {
//   res.json({ message: `Hello Instructor or Admin` });
// });

// app.get('/student-dashboard', protect(['student', 'instructor', 'admin']), (req, res) => {
//   res.json({ message: `Hello Student` });
// });


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware');
const courseRoutes = require('./routes/courseRoutes');
const cors = require('cors');

dotenv.config();

const app = express();

// Allow requests from your React frontend URL
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow both Vite and CRA dev servers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,  // If you use cookies or auth headers
};

app.use(cors(corsOptions));
app.use(express.json());

// 🔗 Connect MongoDB
connectDB();

// 🔐 Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// 🔐 Protected role-based routes
app.get('/admin-dashboard', protect(['admin']), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.userId}` });
});

app.get('/instructor-dashboard', protect(['instructor', 'admin']), (req, res) => {
  res.json({ message: `Hello Instructor or Admin` });
});

app.get('/student-dashboard', protect(['student', 'instructor', 'admin']), (req, res) => {
  res.json({ message: `Hello Student` });
});

// 🌐 Default route
app.get('/', (req, res) => {
  res.send('E-Learning Platform API is running');
});

// ✅ Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
