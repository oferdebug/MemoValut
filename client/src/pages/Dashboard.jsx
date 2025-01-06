import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { FiSearch, FiPlus, FiFolder, FiTag, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import axios from '../utils/axios';
import MemoList from '../components/MemoList';
import CreateMemoModal from '../components/CreateMemoModal';
import EditMemoModal from '../components/EditMemoModal';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [memos, setMemos] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    fetchMemos();
  }, []);

  const fetchMemos = async () => {
    try {
      const response = await axios.get('/api/v1/memos');
      if (response.data && Array.isArray(response.data.memos)) {
        setMemos(response.data.memos);
      } else if (response.data && Array.isArray(response.data)) {
        setMemos(response.data);
      }
    } catch (error) {
      console.error('Error fetching memos:', error);
      toast.error('Failed to fetch memos');
    }
  };

  const handleCreateMemo = async (memo) => {
    try {
      const response = await axios.post('/api/v1/memos', memo);
      setMemos([...memos, response.data]);
      setShowCreateModal(false);
      toast.success('Memo created successfully');
    } catch (error) {
      console.error('Error creating memo:', error);
      toast.error('Failed to create memo');
    }
  };

  const handleEditMemo = async (memo) => {
    try {
      const response = await axios.put(`/api/v1/memos/${memo._id}`, memo);
      const updatedMemos = memos.map((m) =>
        m._id === memo._id ? response.data : m
      );
      setMemos(updatedMemos);
      setShowEditModal(false);
      setSelectedMemo(null);
      toast.success('Memo updated successfully');
    } catch (error) {
      console.error('Error updating memo:', error);
      toast.error('Failed to update memo');
    }
  };

  const handleDeleteMemo = (memoId) => {
    const updatedMemos = memos.filter((memo) => memo._id !== memoId);
    setMemos(updatedMemos);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(memos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMemos(items);
  };

  const filteredMemos = memos.filter((memo) =>
    memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memo.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <nav className="nav-logo">
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>MemoVault</span>
        <div className="nav-actions">
          <button className="theme-btn" onClick={toggleTheme} title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
            {isDark ? <FiSun /> : <FiMoon />}
          </button>
          <span className="dashboard-btn active">
            Dashboard
          </span>
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search memos..."
            className="search-input"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="create-memo-btn" onClick={() => setShowCreateModal(true)}>
          <FiPlus /> New Memo
        </button>
        <div className="sidebar-section">
          <h3>
            <FiFolder /> Categories
          </h3>
          <ul>
            <li className="active">All Memos</li>
            <li>Personal</li>
            <li>Work</li>
            <li>Ideas</li>
          </ul>
        </div>
        <div className="sidebar-section">
          <h3>
            <FiTag /> Tags
          </h3>
          <ul>
            <li>Important</li>
            <li>Todo</li>
            <li>Project</li>
          </ul>
        </div>
      </div>

      <div className="content">
        <div className="content-header">
          <div className="search-bar">
            {/* Removed search bar from here */}
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="memos">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <MemoList
                  memos={filteredMemos}
                  onDelete={handleDeleteMemo}
                  onEdit={(memo) => {
                    setSelectedMemo(memo);
                    setShowEditModal(true);
                  }}
                  onPin={fetchMemos}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {showCreateModal && (
        <CreateMemoModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateMemo}
        />
      )}

      {showEditModal && selectedMemo && (
        <EditMemoModal
          isOpen={showEditModal}
          memo={selectedMemo}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMemo(null);
          }}
          onSubmit={handleEditMemo}
        />
      )}
    </div>
  );
};

export default Dashboard;