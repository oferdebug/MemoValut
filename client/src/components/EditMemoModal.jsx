import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiX } from 'react-icons/fi';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const EditMemoModal = ({ isOpen, memo, onClose, onUpdateMemo }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (memo) {
      setTitle(memo.title);
      setContent(memo.content);
    }
  }, [memo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.put(`/api/v1/memos/${memo._id}`, {
        title: title.trim(),
        content: content.trim(),
        folder: memo.folder || 'default',
        tags: memo.tags || []
      });

      console.log('Update memo response:', response.data);

      if (response.data) {
        toast.success('Memo updated successfully');
        await onUpdateMemo();
      }
    } catch (error) {
      console.error('Error updating memo:', error);
      toast.error(error.response?.data?.message || 'Failed to update memo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Memo</h2>
          <button onClick={onClose} className="modal-close">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title..."
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              placeholder="Write your memo..."
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Memo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditMemoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  memo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    folder: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateMemo: PropTypes.func.isRequired
};

export default EditMemoModal;
