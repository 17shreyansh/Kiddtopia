const { z } = require('zod');

// Define validation schemas for each section of the home page
const sectionSchemas = {
  'About Us': z.object({
    paragraphs: z.array(z.string()).min(1),
    images: z.array(z.string()).optional().default([]),

  }),
  'Why Choose Us': z.object({
    // Updated to allow for empty initial state
    images: z.array(z.string()).optional().default([]),
  }),
  'Gallery': z.object({
    // Updated to allow for empty initial state
    images: z.array(z.string()).optional().default([]),
  }),
  'Testimonials': z.object({
    testimonials: z.array(z.object({
      name: z.string(),
      paragraph: z.string(),
      stars: z.number().min(1).max(5),
    })),
  }),
  'Our Partners': z.object({
    // Updated to allow for empty initial state
    images: z.array(z.string()).optional().default([]),
  }),
  'FAQs': z.object({
    faqs: z.array(z.object({
      title: z.string(),
      content: z.string(),
    })),
  }),
};

module.exports = sectionSchemas;