/* eslint-disable react/prop-types */
function SearchBar({ searchQuery, setSearchQuery, onCreateMemo }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search memos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <button onClick={onCreateMemo} className="btn btn-primary">
        + Create Memo
      </button>
    </div>
  );
}

export default SearchBar;
