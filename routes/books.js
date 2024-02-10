// routes/books.js
const express = require('express');
const router = express.Router();
const Book = require('../models/books');

// Create a new book
router.post('/create', async (req, res) => {
  // console.log(req.body);
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ message: 'Book added successfully', book });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, filterCategory } = req.query;
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      const orConditions = [
        { name: { $regex: new RegExp(search, 'i') } },
        { authorName: { $regex: new RegExp(search, 'i') } },
        { category: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
      ];
    
      query.$or = orConditions;
    }

    if (filterCategory) {
      query.category = filterCategory;
    }

    const [books, totalBooks] = await Promise.all([
      Book.find(query)
        .skip(skip)
        .limit(limit),
      Book.countDocuments(query)
    ]);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
      booksOnCurrentPage: books.length,
      books,
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Get a specific book
router.get('/:id', getBook, (req, res) => {
  res.json(res.book);
});

// Update a book
router.put('/update/:id', getBook, async (req, res) => {
  if (req.body.name != null) {
    res.book.name = req.body.name;
  }
  if (req.body.authorName != null) {
    res.book.authorName = req.body.authorName;
  }
  if (req.body.category != null) {
    res.book.category = req.body.category;
  }
  if (req.body.image != null) {
    res.book.image = req.body.image;
  }
  if (req.body.pdf != null) {
    res.book.pdf = req.body.pdf;
  }
  if (req.body.description != null) {
    res.book.description = req.body.description;
  }
  try {
    const updatedBook = await res.book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a book
router.delete('/delete/:bookId', async (req, res) => {
  try {
    const bookId = req.params.bookId;

    // Check if the order exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Delete the order
    await Book.findByIdAndDelete(bookId);

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    // Handling errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

async function getBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    if (book == null) {
      return res.status(404).json({ message: 'Cannot find book' });
    }
    res.book = book;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
