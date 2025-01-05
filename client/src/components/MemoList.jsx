/* eslint-disable react/prop-types */
import { Draggable } from 'react-beautiful-dnd';
import { FiTrash2, FiEdit2, FiStar } from 'react-icons/fi';
import axios from '../utils/axios';

function MemoList({ memos, onDelete, onEdit, onPin }) {
  const handleDelete = async (memoId) => {
    try {
      await axios.delete(`/memos/${memoId}`);
      onDelete();
    } catch (error) {
      console.error('Error deleting memo:', error);
    }
  };

  const handlePin = async (memoId, isPinned) => {
    try {
      await axios.patch(`/memos/${memoId}`, { isPinned: !isPinned });
      onPin();
    } catch (error) {
      console.error('Error pinning memo:', error);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="memo-grid">
      {memos.map((memo, index) => (
        <Draggable key={memo._id} draggableId={memo._id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="memo-card"
            >
              <div className="memo-card-header">
                <div className="memo-card-title">
                  <h3>{memo.title}</h3>
                  {memo.isPinned && <span className="pinned-badge">Pinned</span>}
                </div>
                <div className="memo-card-actions">
                  <button 
                    className="action-btn"
                    onClick={() => handlePin(memo._id, memo.isPinned)}
                  >
                    <FiStar className={memo.isPinned ? 'starred' : ''} />
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => onEdit(memo)}
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(memo._id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              
              <div className="memo-card-content">
                <p>{memo.content}</p>
              </div>
              
              {memo.tags && memo.tags.length > 0 && (
                <div className="memo-card-tags">
                  {memo.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="memo-card-footer">
                <span className="memo-date">{formatDate(memo.createdAt)}</span>
              </div>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
}

export default MemoList;
