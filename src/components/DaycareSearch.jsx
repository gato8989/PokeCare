import React, { useState, useEffect } from 'react';

const DaycareSearch = ({ onSearch, currentSearch }) => {
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
    <div className="daycare-search">
      <input
        type="text"
        placeholder="Buscar Pokémon en guardería..."
        value={inputValue}
        onChange={handleChange}
        className="search-input"
      />
      {inputValue && (
        <button onClick={handleClear} className="clear-search-btn">
          ×
        </button>
      )}
    </div>
  );
};

export default DaycareSearch;