
const Model = require('../model/blog.model');
const catchAsync = require('../utills/catchAsync');
const AppError = require('../utills/appError');
const helper = require('../controller/handlerFactory');
const he = require('he');
const { preparePostHtml } = require('../utills/postHtml');

exports.createBlog = catchAsync(async (req, res, next) => {
  const { title, titleLink, category, description, author, date, isFeature } = req.body;

  const existingBlog = await Model.findOne({ title: title });
  if (existingBlog) {
    return next(new AppError('This blog already exists!', 401));
  }

  const image = req.body.image || undefined;
  const image_2 = req.body.image_2 || undefined;
  const newBlog = await Model.create({
    title,
    titleLink,
    category,
    description,
    image,
    image_2,
    author,
    date,
    isFeature,
  });

  res.status(201).json({
    status: 'success',
    data: {
      blog: newBlog,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, titleLink,category, description, author, date, isFeature } = req.body;

   
  const image = typeof req.body.image === 'string' ? req.body.image : undefined;
  const image_2 = typeof req.body.image_2 === 'string' ? req.body.image_2 : undefined;

  const updatedBlog = await Model.findByIdAndUpdate(
    id,
    {
      title,
      titleLink,
      category,
      description,
      image,
      image_2,
      author,
      date,
      isFeature,
    },
    { new: true, runValidators: true }
  );

  if (!updatedBlog) {
    return next(new AppError('Blog not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      blog: updatedBlog,
    },
  });
});

exports.addSection = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // const {
  //     heading,
  //     content
  // } = req.body;

  const decodedBody = Object.entries(req.body).reduce((acc, [key, value]) => {
    // Check if value is null or undefined
    acc[key] = value !== null && value !== undefined ? he.decode(value) : '';
    return acc;
  }, {});

  const data = await Model.findById(id);
  if (!data) {
    return next(new AppError('Data not found', 404));
  }

  decodedBody.content = await preparePostHtml(decodedBody.content);

  // const newData = {
  //   heading,
  //   content
  // };

  data.sections.push(decodedBody);
  await data.save();

  res.status(200).json({
    status: 'success',
    data: data,
  });
});

exports.getBlogSections = catchAsync(async (req, res, next) => {
  const { blogId, sectionId } = req.params;

  const data = await Model.findById(blogId);
  if (!data) {
    return next(new AppError('Data not found', 404));
  }

  const data_2 = data.sections.id(sectionId);
  if (!data_2) {
    return next(new AppError('Blog section not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: data_2,
  });
});

exports.updateBlogSection = catchAsync(async (req, res, next) => {
  const { _id, sectionId } = req.params;
  const { heading, content } = req.body;

  const data = await Model.findById(_id);
  if (!data) {
    return next(new AppError('Data not found', 404));
  }

  const sectionToUpdate = data.sections.id(sectionId);
  if (!sectionToUpdate) {
    return next(new AppError("Section not found", 404));
  }
  const decodedHeading = he.decode(heading);
  const decodedContent = await preparePostHtml(he.decode(content));

  sectionToUpdate.heading = decodedHeading;
  sectionToUpdate.content = decodedContent;

  await data.save();

  res.status(200).json({
    status: 'success',
    data: sectionToUpdate,
  });
});

exports.deleteSection = catchAsync(async (req, res, next) => {
  const { _id, sectionId } = req.params;

  const data = await Model.findById(_id);
  if (!data) {
    return next(new AppError('Data not found', 404));
  }

  const data_2 = data.sections.id(sectionId);
  if (!data_2) {
    return next(new AppError('not found', 404));
  }

  data.sections.pull({ _id: sectionId });

  await data.save();

  res.status(204).json({
    status: 'success',
    message: 'Deleted successfully',
  });
});

// ---- Full blog save (details, cover images, post body and FAQs in one request) ----

// "My Blog Title!" -> "my-blog-title"
const slugify = (value) =>
  String(value || '')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// FAQs arrive as JSON text in the multipart form.
const parseList = (value, name) => {
  if (value === undefined || value === null || value === '') return [];
  let list = value;
  if (typeof value === 'string') {
    try {
      list = JSON.parse(value);
    } catch (err) {
      throw new AppError(`${name} must be a JSON array`, 400);
    }
  }
  if (!Array.isArray(list)) throw new AppError(`${name} must be a JSON array`, 400);
  return list;
};

// Multipart fields are not escaped by xss-clean (it only sees JSON bodies), so unlike the JSON
// endpoints above they are used as sent, without he.decode.
const text = (value) => (value !== null && value !== undefined ? String(value) : '');

// Keeps the _id of an existing item so its id does not change on every save.
const keepId = (item, existingIds) => {
  const id = item && item._id ? String(item._id) : '';
  return existingIds.has(id) ? { _id: id } : {};
};

const buildFaqs = async (value, existing = []) => {
  const existingIds = new Set(existing.map((f) => String(f._id)));
  const faqs = [];
  for (const item of parseList(value, 'faqs')) {
    const question = text(item.question).trim();
    const answer = await preparePostHtml(text(item.answer));
    if (!question && !answer.trim()) continue;
    if (!question || !answer.trim()) throw new AppError('Every FAQ needs a question and an answer', 400);
    faqs.push({ ...keepId(item, existingIds), question, answer });
  }
  return faqs;
};

// SEO title/description are plain text: no tags, single spaces, empty -> null (website falls back).
const plainText = (value) => {
  const v = text(value).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return v || null;
};

const checkUnique = async ({ title, titleLink }, ignoreId) => {
  const notSelf = ignoreId ? { _id: { $ne: ignoreId } } : {};
  if (title && (await Model.exists({ title, ...notSelf }))) {
    throw new AppError('A blog with this title already exists!', 400);
  }
  if (titleLink && (await Model.exists({ titleLink, ...notSelf }))) {
    throw new AppError('This title link is already used by another blog', 400);
  }
};

exports.createBlogFull = catchAsync(async (req, res, next) => {
  const { title, category, description, author, date, isFeature } = req.body;
  if (!title || !String(title).trim()) return next(new AppError('Title is required', 400));

  const titleLink = slugify(req.body.titleLink || title);
  if (!titleLink) return next(new AppError('Title link is required', 400));
  await checkUnique({ title, titleLink });

  const image = typeof req.body.image === 'string' && req.body.image ? req.body.image : undefined;
  const image_2 = typeof req.body.image_2 === 'string' && req.body.image_2 ? req.body.image_2 : undefined;

  const blog = await Model.create({
    title,
    titleLink,
    category,
    description,
    image,
    image_2,
    author,
    date,
    isFeature,
    seoTitle: plainText(req.body.seoTitle),
    seoDescription: plainText(req.body.seoDescription),
    content: await preparePostHtml(text(req.body.content)),
    faqs: await buildFaqs(req.body.faqs),
  });

  res.status(201).json({
    status: 'success',
    data: { blog },
  });
});

exports.updateBlogFull = catchAsync(async (req, res, next) => {
  const blog = await Model.findById(req.params.id);
  if (!blog) return next(new AppError('Blog not found', 404));

  const { title, category, description, author, date, isFeature } = req.body;
  if (!title || !String(title).trim()) return next(new AppError('Title is required', 400));

  // The link of a published post only changes when someone edits it (old links would break otherwise).
  let titleLink = blog.titleLink;
  if (req.body.titleLink !== undefined && req.body.titleLink !== blog.titleLink) {
    titleLink = slugify(req.body.titleLink || title);
    if (!titleLink) return next(new AppError('Title link is required', 400));
  }
  await checkUnique(
    { title: title !== blog.title ? title : null, titleLink: titleLink !== blog.titleLink ? titleLink : null },
    blog._id
  );

  // A new cover replaces the old one; otherwise the existing path is kept.
  if (typeof req.body.image === 'string' && req.body.image) blog.image = req.body.image;
  if (typeof req.body.image_2 === 'string' && req.body.image_2) blog.image_2 = req.body.image_2;

  blog.title = title;
  blog.titleLink = titleLink;
  blog.category = category;
  blog.description = description;
  blog.author = author;
  blog.date = date;
  if (isFeature !== undefined) blog.isFeature = isFeature;
  // Old posts keep their `sections` as a backup; the website shows `content` once it is there.
  if (req.body.seoTitle !== undefined) blog.seoTitle = plainText(req.body.seoTitle);
  if (req.body.seoDescription !== undefined) blog.seoDescription = plainText(req.body.seoDescription);
  blog.content = await preparePostHtml(text(req.body.content));
  blog.faqs = await buildFaqs(req.body.faqs, blog.faqs);

  await blog.save();

  res.status(200).json({
    status: 'success',
    data: { blog },
  });
});

exports.deleteBlog = helper.HarddeleteOne(Model);

exports.pagination = helper.paginationOrder(Model, 'title');
exports.getAll = helper.getAllOr(Model);
exports.getOne = helper.getOne(Model);


exports.getAllBlogTitles = async (req, res) => {
  try {
    const blogs = await Model.find({}, 'title titleLink');
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

// exports.reorderBlogs = catchAsync(async (req, res) => {
//   const { orderedIds } = req.body;

//   if (!Array.isArray(orderedIds) || !orderedIds.length) {
//     return res.status(400).json({ message: "Invalid orderedIds" });
//   }

//   await Promise.all(
//     orderedIds.map((id, index) =>
//       Model.findByIdAndUpdate(id, { orderIndex: index })
//     )
//   );

//   res.status(200).json({ message: "Blog order updated successfully" });
// });

exports.updateBlogOrderIndex = catchAsync(async (req, res) => {
  const { id, orderIndex: newIndex } = req.body;

  if (!id || typeof newIndex !== 'number') {
    return res.status(400).json({ message: 'Missing or invalid id/orderIndex' });
  }

  const blog = await Model.findById(id);
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
    await Model.updateMany(
      { orderIndex: { $gt: oldIndex, $lte: newIndex } },
      { $inc: { orderIndex: -1 } }
    );
  } else {
    // Increment orderIndex of blogs between newIndex and oldIndex-1
    await Model.updateMany(
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

// for get all blog titles with orderIndex
exports.getBlogTitlesWithOrder = catchAsync(async (req, res) => {
  const blogs = await Model.find({}, '_id title orderIndex').sort({ orderIndex: 1 });

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: { blogs },
  });
});

exports.updateCslBlogOrder = catchAsync(async (req, res) => {
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

  await Model.bulkWrite(bulkOps);

  res.status(200).json({ status: 'success', message: 'Blog order updated successfully' });
});


// for initialize


exports.initializeBlogOrder = catchAsync(async (req, res) => {
  const blogs = await Model.find().sort({ createdAt: -1 }); 

  await Promise.all(
    blogs.map((blog, index) =>
      Model.findByIdAndUpdate(blog._id, { orderIndex: index })
    )
  );

  res.status(200).json({ message: 'Blog orderIndex initialized successfully.' });
});


// FAQS

exports.addFaq = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const decodedBody = Object.entries(req.body).reduce((acc, [key, value]) => {
    acc[key] = value !== null && value !== undefined ? he.decode(value) : '';
    return acc;
  }, {});

  const blog = await Model.findById(id);
  if (!blog) return next(new AppError('Blog not found', 404));

  decodedBody.answer = await preparePostHtml(decodedBody.answer);
  blog.faqs.push(decodedBody);
  await blog.save();

  res.status(200).json({
    status: 'success',
    data: blog,
  });
});

exports.getFaq = catchAsync(async (req, res, next) => {
  const { blogId, faqId } = req.params;

  const blog = await Model.findById(blogId);
  if (!blog) return next(new AppError('Blog not found', 404));

  const faq = blog.faqs.id(faqId);
  if (!faq) return next(new AppError('FAQ not found', 404));

  res.status(200).json({
    status: 'success',
    data: faq,
  });
});

exports.updateFaq = catchAsync(async (req, res, next) => {
  const { blogId, faqId } = req.params;
  const { question, answer } = req.body;

  const blog = await Model.findById(blogId);
  if (!blog) return next(new AppError('Blog not found', 404));

  const faqToUpdate = blog.faqs.id(faqId);
  if (!faqToUpdate) return next(new AppError('FAQ not found', 404));

  faqToUpdate.question = he.decode(question);
  faqToUpdate.answer = await preparePostHtml(he.decode(answer));

  await blog.save();

  res.status(200).json({
    status: 'success',
    data: faqToUpdate,
  });
});


exports.deleteFaq = catchAsync(async (req, res, next) => {
  const { blogId, faqId } = req.params;

  const blog = await Model.findById(blogId);
  if (!blog) return next(new AppError('Blog not found', 404));

  const faq = blog.faqs.id(faqId);
  if (!faq) return next(new AppError('FAQ not found', 404));

  blog.faqs.pull({ _id: faqId });
  await blog.save();

  res.status(204).json({
    status: 'success',
    message: 'FAQ deleted successfully',
  });
});



exports.getLatestBlogs = async (req, res) => {
  try {
    const blogs = await Model.find(
      {},
      'title titleLink description image author createdAt'
    )
      .sort({ createdAt: -1 }) // newest first
      .limit(5);

    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};
