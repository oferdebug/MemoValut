import React from 'react';
import PropTypes from 'prop-types';
import { FiFolder, FiTag } from 'react-icons/fi';

const Sidebar = ({
  folders,
  selectedFolder,
  setSelectedFolder,
  tags,
  selectedTags,
  setSelectedTags,
}) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto">
      <div className="p-4">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiFolder className="mr-2" />
            Folders
          </h2>
          <ul className="space-y-2">
            {folders.map((folder) => (
              <li
                key={folder}
                className={`cursor-pointer p-2 rounded transition-colors ${
                  selectedFolder === folder
                    ? 'bg-blue-100 text-blue-600'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedFolder(folder)}
              >
                {folder}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiTag className="mr-2" />
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`px-2 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() =>
                  setSelectedTags(
                    selectedTags.includes(tag)
                      ? selectedTags.filter((t) => t !== tag)
                      : [...selectedTags, tag]
                  )
                }
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedFolder: PropTypes.string.isRequired,
  setSelectedFolder: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelectedTags: PropTypes.func.isRequired,
};

export default Sidebar;