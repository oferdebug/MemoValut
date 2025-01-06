import Memo from '../../models/memo/MemoModel.js';
import { handleAsync } from '../../helpers/errorhandler.js';

// Create a new memo
export const createMemo = handleAsync(async (req, res) => {
  const { content, title, tags, format, folder, color } = req.body;
  const memo = await Memo.create({
    user: req.user._id,
    content,
    title,
    tags,
    format,
    folder,
    color
  });
  res.status(201).json(memo);
});

// Get all memos for a user with filtering and search
export const getMemos = handleAsync(async (req, res) => {
  const {
    search,
    tags,
    folder,
    sort = '-createdAt',
    format,
    isArchived = false,
    page = 1,
    limit = 50
  } = req.query;

  const query = { user: req.user._id, isArchived };

  // Search in content, title, and tags
  if (search) {
    query.$text = { $search: search };
  }

  // Filter by tags
  if (tags) {
    query.tags = { $all: tags.split(',') };
  }

  // Filter by folder
  if (folder) {
    query.folder = folder;
  }

  // Filter by format
  if (format) {
    query.format = format;
  }

  const memos = await Memo.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Memo.countDocuments(query);

  res.json({
    memos,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
    total
  });
});

// Update a memo
export const updateMemo = handleAsync(async (req, res) => {
  const {
    content,
    title,
    tags,
    isPinned,
    format,
    folder,
    color
  } = req.body;

  const memo = await Memo.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!memo) {
    return res.status(404).json({ message: 'Memo not found' });
  }

  if (content) memo.content = content;
  if (title !== undefined) memo.title = title;
  if (tags) memo.tags = tags;
  if (isPinned !== undefined) memo.isPinned = isPinned;
  if (format) memo.format = format;
  if (folder) memo.folder = folder;
  if (color) memo.color = color;

  await memo.save();
  res.json(memo);
});

// Delete a memo (or archive it)
export const deleteMemo = handleAsync(async (req, res) => {
  const { archive } = req.query;
  const memo = await Memo.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!memo) {
    return res.status(404).json({ message: 'Memo not found' });
  }

  if (archive === 'true') {
    memo.isArchived = true;
    await memo.save();
    res.json({ message: 'Memo archived successfully' });
  } else {
    await memo.deleteOne();
    res.json({ message: 'Memo deleted successfully' });
  }
});

// Share a memo with other users
export const shareMemo = handleAsync(async (req, res) => {
  const { users } = req.body;
  const memo = await Memo.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!memo) {
    return res.status(404).json({ message: 'Memo not found' });
  }

  memo.sharedWith = users;
  await memo.save();
  res.json(memo);
});

// Get all folders
export const getFolders = handleAsync(async (req, res) => {
  const folders = await Memo.distinct('folder', { user: req.user._id });
  res.json(folders);
});

// Get all tags
export const getTags = handleAsync(async (req, res) => {
  const tags = await Memo.distinct('tags', { user: req.user._id });
  res.json(tags);
});

// Bulk actions (archive, delete, move to folder)
export const bulkAction = handleAsync(async (req, res) => {
  const { ids, action, folder } = req.body;

  switch (action) {
    case 'archive':
      await Memo.updateMany(
        { _id: { $in: ids }, user: req.user._id },
        { isArchived: true }
      );
      break;
    case 'delete':
      await Memo.deleteMany({ _id: { $in: ids }, user: req.user._id });
      break;
    case 'move':
      await Memo.updateMany(
        { _id: { $in: ids }, user: req.user._id },
        { folder }
      );
      break;
    default:
      return res.status(400).json({ message: 'Invalid action' });
  }

  res.json({ message: 'Bulk action completed successfully' });
});
