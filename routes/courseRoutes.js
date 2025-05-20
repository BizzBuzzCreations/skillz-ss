const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

const { protect } = require('../middleware/authMiddleware');

// 🔐 Only 'instructor' and 'admin' can create/update/delete
router.post('/', protect(['admin', 'instructor']), createCourse);
router.patch('/:id', protect(['admin', 'instructor']), updateCourse);
router.delete('/:id', protect(['admin', 'instructor']), deleteCourse);

// 🌍 Public or auth user can read
router.get('/', getCourses);
router.get('/:id', getCourseById);

module.exports = router;
