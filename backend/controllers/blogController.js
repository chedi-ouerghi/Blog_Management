const Blog = require('../models/Blog');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');


exports.createBlog = [
  body('title').notEmpty().withMessage('Le titre est requis'),
  body('content').notEmpty().withMessage('Le contenu est requis'),
  body('category').isIn(['Scientific', 'IT']).withMessage('La catégorie doit être "Scientific" ou "IT"'),
  body('tags').optional().isArray().withMessage('Les tags doivent être un tableau de chaînes de caractères'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      
      const blog = await Blog.create({
        title,
        content,
        tags,
        category,
        image,
        user: req.user._id,
        status: 'pending',  
      });

      
      res.status(201).json({
        message: 'Votre blog a été créé avec succès et est en attente d\'approbation de l\'administrateur.',
        blog,  
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];



exports.getBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const totalBlogs = await Blog.countDocuments({ status: 'approved' }); 
  const totalPages = Math.ceil(totalBlogs / limit);

  const blogs = await Blog.find({ status: 'approved' }) 
    .populate('user', 'name email') 
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({
    blogs,
    page,
    totalPages,
  });
});

exports.getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user', 'name email role'); 
  if (!blog) {
    return res.status(404).json({ message: 'Blog non trouvé' });
  }
  res.json(blog);
});


exports.updateBlog = [
  body('title').optional().notEmpty().withMessage('Le titre ne peut pas être vide'),
  body('content').optional().notEmpty().withMessage('Le contenu ne peut pas être vide'),
  body('category').optional().isIn(['Scientific', 'IT']).withMessage('La catégorie doit être "Scientific" ou "IT"'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog non trouvé' });
    }

    
    if (blog.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const updates = req.body;
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updatedBlog);
  })
];


exports.deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: 'Blog non trouvé' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé, vous n\'êtes pas admin' });
  }

  await blog.deleteOne();
  res.json({ message: 'Blog supprimé' });
});


exports.getBlogsAdmin = asyncHandler(async (req, res) => {
  try {
    
    const blogs = await Blog.find()
      .populate('user', 'name email role') 
      .sort({ createdAt: -1 }); 

    res.status(200).json({
      message: 'Tous les blogs récupérés avec succès.',
      blogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des blogs.', error: error.message });
  }
});


exports.approveBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: 'Blog non trouvé' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé, vous n\'êtes pas admin' });
  }

  
  blog.status = 'approved';
  await blog.save();

  res.json({ message: 'Blog approuvé avec succès' });
});


exports.rejectBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: 'Blog non trouvé' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé, vous n\'êtes pas admin' });
  }

  
  blog.status = 'rejected';
  await blog.save();

  res.json({ message: 'Blog rejeté avec succès' });
});


exports.deleteAllBlogs = async (req, res) => {
    try {
        await Blog.deleteMany({});
        res.status(200).json({ message: 'Tous les blogs ont été supprimés avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression des blogs.', error: error.message });
    }
};
