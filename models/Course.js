const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: String,
  type: {
    type: String,
    enum: ['video', 'pdf', 'text'],
    required: true,
  },
  url: {
    type: String, // Link to S3, Cloudinary, or local file
    required: true,
  },
  duration: Number, // only for video
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  content: [
    {
      sectionTitle: String,
      resources: [resourceSchema],
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Course', courseSchema);
