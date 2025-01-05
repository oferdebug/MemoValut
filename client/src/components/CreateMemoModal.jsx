/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from '../utils/axios';

function CreateMemoModal({ onClose, onMemoCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folder, setFolder] = useState('default');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/memos', {
        title,
        content,
        folder,
        tags,
      });
      onMemoCreated();
      onClose();
    } catch (error) {
      console.error('Error creating memo:', error);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Memo</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              placeholder="Write your title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-control"
              placeholder="Write your memo..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="folder">Folder</label>
            <select
              id="folder"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="form-control"
            >
              <option value="default">default</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tag-input-container">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="form-control"
                placeholder="Add a tag..."
              />
              <button
                onClick={handleAddTag}
                className="btn btn-primary"
                type="button"
              >
                Add
              </button>
            </div>
            <div className="tags-list">
              {tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="remove-tag"
                    type="button"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMemoModal;
