const express = require('express');
const multer = require('multer');
const path = require('path');
const { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog, approveBlog, rejectBlog,deleteAllBlogs, getBlogsAdmin } = require('../controllers/blogController');
const { isAdmin, protect } = require('../middlewares/authMiddleware');
const handleValidationErrors = require('../middlewares/ValidationErrors');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = Date.now() + extname;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|png/;
    const extname = fileTypes.test(file.mimetype);
    const basename = fileTypes.test(path.extname(file.originalname));
    if (extname && basename) {
      return cb(null, true);
    } else {
      return cb(new Error('Seuls les fichiers image sont autorisés.'));
    }
  }
});

router.post('/', protect, upload.single('image'), createBlog, handleValidationErrors);
router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.put('/:id', protect, upload.single('image'), updateBlog, handleValidationErrors);
router.delete('/:id', protect, isAdmin, deleteBlog);


router.get('/admin/blogs', protect, isAdmin, getBlogsAdmin);
router.put('/:id/approve', protect, isAdmin, approveBlog);
router.put('/:id/reject', protect, isAdmin, rejectBlog);


router.delete('/blogs', deleteAllBlogs);

module.exports = router;
