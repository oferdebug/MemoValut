/* eslint-disable react/prop-types */
function Sidebar({
  folders,
  selectedFolder,
  setSelectedFolder,
  tags,
  selectedTags,
  setSelectedTags,
}) {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h2 className="sidebar-title">Folders</h2>
        <ul className="sidebar-list">
          {folders.map((folder) => (
            <li key={folder}>
              <button
                onClick={() => setSelectedFolder(folder)}
                className={`sidebar-item ${
                  selectedFolder === folder ? 'active' : ''
                }`}
              >
                📁 {folder}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <h2 className="sidebar-title">Tags</h2>
        <div className="tag-list">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTags(
                  selectedTags.includes(tag)
                    ? selectedTags.filter((t) => t !== tag)
                    : [...selectedTags, tag]
                );
              }}
              className={`tag ${selectedTags.includes(tag) ? 'active' : ''}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
