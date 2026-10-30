const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../../utills/catchAsync');
const AppError = require('../../utills/appError');
const helper = require('../../controller/handlerFactory');
const tmgsBlog = require('../../model/tmgsModels/tmgsBlog.model');
const he = require('he');

exports.createBlog = catchAsync(async (req, res, next) => {
  const {
    title,
    titleLink,
    description,
    category,
    time,
    author,
    content,
    image,
    faqs,
  } = req.body;

  // Check if title already exists
  const existingBlog = await tmgsBlog.findOne({ title });
  if (existingBlog) {
    return next(new AppError('A blog with this title already exists!', 400));
  }

  const decodedContent = he.decode(content);
  let parsedFaqs = [];

  // ✅ Safely parse and decode FAQs
  try {
    const faqList = typeof faqs === 'string' ? JSON.parse(faqs) : [];
    parsedFaqs = faqList.map((faq) => ({
      question: faq.question,
      answer: he.decode(faq.answer), // ✅ decode HTML content
    }));
  } catch (err) {
    return next(new AppError('Invalid FAQ format', 400));
  }

  const newBlog = await tmgsBlog.create({
    title,
    titleLink,
    image,
    description,
    category,
    time,
    author,
    content: decodedContent,
    faqs: parsedFaqs,
  });

  res.status(201).json({
    status: 'success',
    data: newBlog,
  });
});

exports.updateTmgsBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    titleLink,
    description,
    category,
    time,
    author,
    content,
    image,
    faqs,
  } = req.body;

  const blog = await tmgsBlog.findById(id);
  if (!blog) {
    return next(new AppError('Blog not found!', 404));
  }

  const updatedContent = content ? he.decode(content) : blog.content;

  let parsedFaqs = blog.faqs;
  try {
    if (typeof faqs === 'string') {
      const faqList = JSON.parse(faqs);
      parsedFaqs = faqList.map((faq) => ({
        question: faq.question,
        answer: he.decode(faq.answer), 
      }));
    }
  } catch (err) {
    return next(new AppError('Invalid FAQ format', 400));
  }

  blog.title = title || blog.title;
  blog.titleLink = titleLink || blog.titleLink;
  blog.image = image || blog.image;
  blog.description = description || blog.description;
  blog.category = category || blog.category;
  blog.time = time || blog.time;
  blog.author = author || blog.author;
  blog.content = updatedContent;
  blog.faqs = parsedFaqs;

  await blog.save();

  res.status(200).json({
    status: 'success',
    data: blog,
  });
});

exports.getAllBlogs = helper.paginationOrder(tmgsBlog, 'title', {
  populate: 'category',
});

exports.getAll = helper.getAllOr(tmgsBlog, { populate: 'category' });

exports.getBlogById = helper.getOne(tmgsBlog, 'category');

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Find and delete the blog
  const blog = await tmgsBlog.findByIdAndDelete(id);

  // If the blog is not found
  if (!blog) {
    return next(new AppError('Blog not found!', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Blog deleted successfully!',
  });
});

exports.updateBlogOrderIndex = catchAsync(async (req, res) => {
  const { id, orderIndex: newIndex } = req.body;

  if (!id || typeof newIndex !== 'number') {
    return res
      .status(400)
      .json({ message: 'Missing or invalid id/orderIndex' });
  }

  const blog = await tmgsBlog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  const oldIndex = blog.orderIndex;

  if (oldIndex === newIndex) {
    return res.status(200).json({ message: 'No change needed', data: blog });
  }

  // Move others out of the way
  if (newIndex > oldIndex) {
    // Decrement orderIndex of blogs between oldIndex+1 and newIndex
    await tmgsBlog.updateMany(
      { orderIndex: { $gt: oldIndex, $lte: newIndex } },
      { $inc: { orderIndex: -1 } }
    );
  } else {
    // Increment orderIndex of blogs between newIndex and oldIndex-1
    await tmgsBlog.updateMany(
      { orderIndex: { $gte: newIndex, $lt: oldIndex } },
      { $inc: { orderIndex: 1 } }
    );
  }

  // Update this blog
  blog.orderIndex = newIndex;
  await blog.save();

  res.status(200).json({
    message: 'Blog orderIndex updated successfully',
    data: blog,
  });
});

// for initialize

exports.initializeBlogOrder = catchAsync(async (req, res) => {
  const blogs = await tmgsBlog.find().sort({ createdAt: -1 });

  await Promise.all(
    blogs.map((blog, index) =>
      tmgsBlog.findByIdAndUpdate(blog._id, { orderIndex: index })
    )
  );

  res
    .status(200)
    .json({ message: 'Blog orderIndex initialized successfully.' });
});

/// for buldk update order index

exports.getBlogTitles = catchAsync(async (req, res) => {
  const blogs = await tmgsBlog
    .find({}, '_id title orderIndex')
    .sort({ orderIndex: 1 });

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: { blogs },
  });
});

// UPDATE blog order
exports.updateBlogOrder = catchAsync(async (req, res) => {
  const updates = req.body.orders; // Expecting [{ blogId: '...', orderIndex: 1 }, ...]

  if (!Array.isArray(updates)) {
    return res.status(400).json({ status: 'fail', message: 'Invalid format' });
  }

  const bulkOps = updates.map(({ blogId, orderIndex }) => ({
    updateOne: {
      filter: { _id: blogId },
      update: { orderIndex },
    },
  }));

  await tmgsBlog.bulkWrite(bulkOps);

  res
    .status(200)
    .json({ status: 'success', message: 'Blog order updated successfully' });
});



exports.increaseViews = catchAsync(async (req, res) => {
  try {
    const blog = await tmgsBlog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({
      status: 'success',
      data: blog,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating views', error: err.message });
  }
});
