// routes/blogs.js
const express = require('express');
const router = express.Router();
const Blog = require('../models/blogs');

// Create a new blog
router.post('/create', async (req, res) => {
  // console.log(req.body);
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({ message: 'Blog added successfully', blog });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all blogs
router.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 10, search, category } = req.query;
      let query = {};
  
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
  
      if (category) {
        query.category = category;
      }
  
      const totalCount = await Blog.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);
      const offset = (page - 1) * limit;
  
      const blogs = await Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(parseInt(limit));
  
      res.json({
        blogs,
        totalPages,
        currentPage: parseInt(page),
        totalCount
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Get a specific blog
router.get('/:id', getBlog, (req, res) => {
  res.json(res.blog);
});

// Update a blog
router.put('/update/:id', getBlog, async (req, res) => {
  if (req.body.title != null) {
    res.blog.title = req.body.title;
  }
  if (req.body.description != null) {
    res.blog.description = req.body.description;
  }
  if (req.body.category != null) {
    res.blog.category = req.body.category;
  }
  if (req.body.image != null) {
    res.blog.image = req.body.image;
  }
  if (req.body.blogLink != null) {
    res.blog.blogLink = req.body.blogLink;
  }
  try {
    const updatedblog = await res.blog.save();
    res.json({message: "Blog updated Successfully",updatedblog});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a blog
router.delete('/delete/:blogId', async (req, res) => {
  try {
    const blogId = req.params.blogId;

    // Check if the order exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'blog not found' });
    }

    // Delete the order
    await Blog.findByIdAndDelete(blogId);

    res.status(200).json({ message: 'blog deleted successfully' });
  } catch (error) {
    // Handling errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

async function getBlog(req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog == null) {
      return res.status(404).json({ message: 'Cannot find blog' });
    }
    res.blog = blog;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
