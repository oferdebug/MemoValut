import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { FiStar, FiEdit2, FiTrash2 } from 'react-icons/fi';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const MemoList = ({ memos, onDelete, onEdit, onPin }) => {
  const handleDelete = async (memoId) => {
    try {
      await axios.delete(`/api/v1/memos/${memoId}`);
      toast.success('Memo deleted successfully');
      onDelete(memoId);
    } catch (error) {
      console.error('Error deleting memo:', error);
      toast.error('Failed to delete memo');
    }
  };

  const handlePin = async (memoId, isPinned) => {
    try {
      const response = await axios.put(`/api/v1/memos/${memoId}`, {
        isPinned: !isPinned,
        pinned: !isPinned  // Try both field names
      });
      
      if (response.data) {
        toast.success(isPinned ? 'Memo unpinned' : 'Memo pinned');
        onPin();
      }
    } catch (error) {
      console.error('Error pinning memo:', error);
      toast.error('Failed to update memo');
    }
  };

  if (!memos || memos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3>No memos yet</h3>
        <p>Create your first memo to get started!</p>
      </div>
    );
  }

  return (
    <div className="memo-list">
      {memos.map((memo, index) => (
        <Draggable key={memo._id} draggableId={memo._id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="memo-card"
            >
              <h3>{memo.title}</h3>
              <p>{memo.content}</p>
              <div className="memo-card-actions">
                <button onClick={() => handlePin(memo._id, memo.isPinned)} title={memo.isPinned ? "Unpin" : "Pin"}>
                  <FiStar className={memo.isPinned ? "starred" : ""} />
                </button>
                <button onClick={() => onEdit(memo)} title="Edit">
                  <FiEdit2 />
                </button>
                <button onClick={() => handleDelete(memo._id)} title="Delete">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

MemoList.propTypes = {
  memos: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      isPinned: PropTypes.bool
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onPin: PropTypes.func.isRequired
};

export default MemoList;
