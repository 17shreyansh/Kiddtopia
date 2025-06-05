// models/Newsletter.js
const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email address'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date,
    default: null
  },
  // Optional: Track subscription source
  source: {
    type: String,
    default: 'website',
    enum: ['website', 'api', 'import', 'manual']
  },
  // Optional: Additional metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});


newsletterSchema.index({ isActive: 1 });
newsletterSchema.index({ createdAt: -1 });

// Virtual for formatted subscription date
newsletterSchema.virtual('formattedSubscribedAt').get(function() {
  return this.subscribedAt.toLocaleDateString();
});

// Method to unsubscribe
newsletterSchema.methods.unsubscribe = function() {
  this.isActive = false;
  this.unsubscribedAt = new Date();
  return this.save();
};

// Method to resubscribe
newsletterSchema.methods.resubscribe = function() {
  this.isActive = true;
  this.unsubscribedAt = null;
  return this.save();
};

// Static method to get active subscribers count
newsletterSchema.statics.getActiveSubscribersCount = function() {
  return this.countDocuments({ isActive: true });
};

// Static method to get subscribers by date range
newsletterSchema.statics.getSubscribersByDateRange = function(startDate, endDate) {
  return this.find({
    subscribedAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ subscribedAt: -1 });
};

module.exports = mongoose.model('Newsletter', newsletterSchema);