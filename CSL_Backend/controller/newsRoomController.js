const multer = require('multer');
const sharp = require('sharp');
const Model = require('../model/newsRoom.model');
const catchAsync = require('../utills/catchAsync');
const AppError = require('../utills/appError');
const helper = require('../controller/handlerFactory');
const he = require('he');
const { preparePostHtml } = require('../utills/postHtml');

const parseData = (data) => {
  if (Array.isArray(data)) {
    return data;
  } else if (typeof data === 'string') {
    return data.split(',').map((part) => part.trim());
  } else {
    throw new AppError('Invalid data format', 400);
  }
};

exports.create = catchAsync(async (req, res, next) => {
  const {
    title,
    titleLink,
    description,
    author,
    date,
    content,
    feed,
    isFeature,
    isPreviousFeature,
  } = req.body;

  const decodedContent = await preparePostHtml(he.decode(content));
  const parsed = parseData(feed);
  const existingData = await Model.findOne({ title: title });
  if (existingData) {
    return next(new AppError('This news  already exists!', 401));
  }
  const image = req.body.image || undefined;
  const image_2 = req.body.image_2 || undefined;

  const newData = await Model.create({
    title,
    titleLink,
    description,
    image,
    image_2,
    author,
    date,
    content: decodedContent,
    feed: parsed,
    isFeature,
    isPreviousFeature,
  });

  res.status(201).json({
    status: 'success',
    data: newData,
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    titleLink,
    description,
    author,
    date,
    content,
    feed,
    isFeature,
    isPreviousFeature,
  } = req.body;

  const image = typeof req.body.image === 'string' ? req.body.image : undefined;
  const image_2 =
    typeof req.body.image_2 === 'string' ? req.body.image_2 : undefined;
  const parsed = parseData(feed);
  const decodedContent = await preparePostHtml(he.decode(content));
  const updatedNews = await Model.findByIdAndUpdate(
    id,
    {
      title,
      titleLink,
      description,
      image,
      image_2,
      author,
      date,
      content: decodedContent,
      feed: parsed,
      isFeature,
      isPreviousFeature,
    },
    { new: true, runValidators: true }
  );

  if (!updatedNews) {
    return next(new AppError('Data not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: updatedNews,
  });
});

exports.delete = helper.HarddeleteOne(Model);
exports.pagination = helper.pagination(Model, 'title');
exports.getAll = helper.getAll(Model);
exports.getOne = helper.getOne(Model);
