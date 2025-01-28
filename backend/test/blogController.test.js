const request = require('supertest');
const server = require('../server'); // Supposons que ton app Express est exportée depuis app.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Blog = require('../models/Blog');
const jwt = require('jsonwebtoken');

describe('Blog Controller Tests', () => {
  let adminToken;
  let userToken;
  let blogId;

  // Configuration de la base de données avant les tests
  beforeAll(async () => {
    // Connexion à MongoDB (assure-toi d'utiliser une base de données de test)
    await mongoose.connect('mongodb://localhost/testdb', { useNewUrlParser: true, useUnifiedTopology: true });

    // Création d'un utilisateur admin et d'un utilisateur normal
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user'
    });

    // Génération des tokens pour les tests d'authentification
    adminToken = jwt.sign({ id: adminUser._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    userToken = jwt.sign({ id: regularUser._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Création d'un blog pour les tests
    const blog = await Blog.create({
      title: 'Test Blog',
      content: 'This is a test blog content.',
      category: 'Scientific'
    });
    blogId = blog._id.toString();
  });

  afterAll(async () => {
    // Nettoyage après les tests
    await Blog.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  it('should create a blog with admin', async () => {
    const res = await request(server)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'New Blog',
        content: 'This is a new blog content.',
        category: 'IT'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('title', 'New Blog');
    expect(res.body).toHaveProperty('category', 'IT');
  });

  it('should fail to create a blog without admin token', async () => {
    const res = await request(server)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'New Blog',
        content: 'This is a new blog content.',
        category: 'IT'
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Accès refusé, vous n\'êtes pas admin');
  });

  it('should delete a blog with admin role', async () => {
    const res = await request(server)
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Blog supprimé');
  });

  it('should fail to delete a blog with user role', async () => {
    const res = await request(server)
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Accès refusé, vous n\'êtes pas admin');
  });

  it('should get all blogs', async () => {
    const res = await request(server).get('/api/blogs');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a single blog by id', async () => {
    const res = await request(server).get(`/api/blogs/${blogId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title', 'Test Blog');
  });

  it('should return 404 if blog not found', async () => {
    const res = await request(server).get('/api/blogs/invalidBlogId');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Blog not found');
  });
});
