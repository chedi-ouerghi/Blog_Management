const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    category: { type: String, required: true, enum: ['Scientific', 'IT'] },
    image: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
 