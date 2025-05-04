import React, { useState, useEffect } from 'react';
import 'material-symbols';

const DaycareSearch = ({ onSearch, currentSearch, darkMode }) => {
  const [inputValue, setInputValue] = useState(currentSearch);

  // Sincroniza cuando cambia la prop
  useEffect(() => {
    setInputValue(currentSearch);
  }, [currentSearch]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <div className="relative flex items-center">
        <span className={`absolute left-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span className="material-symbols-outlined">search</span>
        </span>
        <input
          type="text"
          placeholder="Buscar Pokémon en guardería..."
          value={inputValue}
          onChange={handleChange}
          className={`w-full pl-10 pr-10 py-2 ${darkMode ? 'dark-input border-gray-700 text-white' : 'border border-gray-300'} rounded-full focus:outline-none focus:ring-2 focus:ring-pokemon-blue shadow-sm transition-colors duration-300`}
        />
        {inputValue && (
          <button 
            onClick={handleClear} 
            className={`absolute right-3 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} focus:outline-none transition-colors duration-300`}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DaycareSearch;