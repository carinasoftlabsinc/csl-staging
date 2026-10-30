
const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: null,
    },
    titleLink: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    image_2: {
      type: String,
      default: null,
    },
    author: {
      type: String,
      default: null,
    },
    date: {
      type: String,
      default: null,
    },
    // Search result title and description. Empty: the website uses the post title and description.
    seoTitle: {
      type: String,
      default: null,
    },
    seoDescription: {
      type: String,
      default: null,
    },
    // The whole post body as one HTML document; its <h2> headings build the table of contents.
    content: {
      type: String,
      default: null,
    },
    // Old posts only (one entry per heading). Kept until every post has `content`.
    sections: [
      {
        heading: { type: String, default: null },
        content: { type: String, default: null },
      },
    ],
    faqs: [
      {
        question: { type: String, default: null },
        answer: { type: String, default: null },
      },
    ],
    isFeature: {
      type: Boolean,
      default: false,
    },
    orderIndex: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
