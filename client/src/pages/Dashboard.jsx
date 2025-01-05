import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { FiSearch, FiPlus, FiFolder, FiTag, FiEdit3 } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import MemoList from '../components/MemoList';
import CreateMemoModal from '../components/CreateMemoModal';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [memos, setMemos] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('default');

  useEffect(() => {
    fetchFolders();
    fetchTags();
    fetchMemos();
  }, [selectedFolder, selectedTags, searchQuery]);

  const fetchFolders = async () => {
    try {
      const response = await axios.get('/api/v1/memos/folders');
      setFolders(['default', ...response.data]);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/v1/memos/tags');
      setTags(response.data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchMemos = async () => {
    try {
      const params = {
        folder: selectedFolder !== 'default' ? selectedFolder : undefined,
        tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
        search: searchQuery || undefined,
      };
      const response = await axios.get('/api/v1/memos', { params });
      setMemos(response.data);
    } catch (error) {
      console.error('Error fetching memos:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;

    const movedMemo = memos[source.index];
    const newMemos = [...memos];
    newMemos.splice(source.index, 1);
    newMemos.splice(destination.index, 0, movedMemo);
    setMemos(newMemos);

    try {
      await axios.patch(`/api/v1/memos/${movedMemo.id}/reorder`, {
        newIndex: destination.index,
      });
    } catch (error) {
      console.error('Error reordering memo:', error);
      fetchMemos(); // Refresh the list if reordering fails
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        folders={folders}
        tags={tags}
        selectedFolder={selectedFolder}
        selectedTags={selectedTags}
        onFolderSelect={setSelectedFolder}
        onTagSelect={(tag) => {
          setSelectedTags((prev) =>
            prev.includes(tag)
              ? prev.filter((t) => t !== tag)
              : [...prev, tag]
          );
        }}
      />
      
      <main className="flex-1 overflow-auto pl-[250px]">
        <nav className="nav">
          <div className="nav-content">
            <h1 className="logo">MemoVault</h1>
            <button
              className="create-memo-btn"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <FiPlus />
              New Memo
            </button>
          </div>
        </nav>

        <div className="container">
          <div className="search-bar">
            <div className="search-input-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search memos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="memo-list">
              {(provided) => (
                <div
                  className="memo-list"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <MemoList memos={memos} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </main>

      {isCreateModalOpen && (
        <CreateMemoModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateMemo={fetchMemos}
          folders={folders}
          tags={tags}
        />
      )}
    </div>
  );
};

export default Dashboard;