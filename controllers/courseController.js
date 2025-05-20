const Course = require('../models/Course');

// 👉 CREATE Course
exports.createCourse = async (req, res) => {
  const { title, description, content } = req.body;

  try {
    const newCourse = new Course({
      title,
      description,
      content,
      instructor: req.user.userId,
    });

    await newCourse.save();

    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    res.status(500).json({ error: 'Server error creating course' });
  }
};

// 👉 GET All Courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email role');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching courses' });
  }
};

// 👉 GET One Course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email role');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching course' });
  }
};

// 👉 UPDATE Course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Allow only admin/instructor to edit their course
    if (
      req.user.role !== 'admin' &&
      course.instructor.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }

    // Apply only fields provided in req.body
    Object.keys(req.body).forEach((key) => {
      course[key] = req.body[key];
    });

    await course.save();

    res.json({ message: 'Course updated (PATCH)', course });
  } catch (error) {
    res.status(500).json({ error: 'Error updating course' });
  }
};

// 👉 DELETE Course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (
      req.user.role !== 'admin' &&
      course.instructor.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: 'Not authorized to delete this course' });
    }

    // await course.remove();
    await course.deleteOne({ _id: req.params.id });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting course' });
  }
};
