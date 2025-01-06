import mongoose from 'mongoose';

const memoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  folder: {
    type: String,
    default: 'default'
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  format: {
    type: String,
    enum: ['plain', 'markdown'],
    default: 'plain'
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  color: {
    type: String,
    default: '#ffffff'
  },
  lastEditedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add text index for search
memoSchema.index({ content: 'text', title: 'text', tags: 'text' });

// Update lastEditedAt on save
memoSchema.pre('save', function(next) {
  this.lastEditedAt = new Date();
  next();
});

const Memo = mongoose.model('Memo', memoSchema);

export default Memo;
