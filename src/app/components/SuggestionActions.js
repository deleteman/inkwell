// SuggestionActions.js
import React from 'react';

const SuggestionActions = ({ 
  applied, 
  ignored, 
  onApply, 
  onIgnore 
}) => {
  if (applied || ignored) return null;

  return (
    <div className="flex items-center mt-2">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={onApply}
        aria-label="Apply suggestion"
      >
        Apply
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
        onClick={onIgnore}
        aria-label="Ignore suggestion"
      >
        Ignore
      </button>
    </div>
  );
};

export default React.memo(SuggestionActions);
