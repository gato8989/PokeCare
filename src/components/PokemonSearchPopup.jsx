import React, { useState } from 'react';
import axios from 'axios';

const PokemonSearchPopup = ({ onAddPokemon, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchPokemon = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      setSearchResults([response.data]);
    } catch (error) {
      setSearchResults([]);
      alert('Pokémon no encontrado');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = (pokemon) => {
    onAddPokemon({
      id: pokemon.id,
      name: pokemon.name,
      sprites: pokemon.sprites,
    });
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="popup-overlay">
      <div className="search-popup">
        <button className="close-popup" onClick={onClose}>×</button>
        <h3>Buscar Pokémon para agregar</h3>
        <div className="popup-search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nombre o número"
            onKeyPress={(e) => e.key === 'Enter' && searchPokemon()}
          />
          <button onClick={searchPokemon} disabled={isSearching}>
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        
        {searchResults.length > 0 && (
          <div className="popup-search-results">
            {searchResults.map((pokemon) => (
              <div key={pokemon.id} className="popup-pokemon-result">
                <img 
                  src={pokemon.sprites.front_default} 
                  alt={pokemon.name} 
                />
                <h4>{pokemon.name}</h4>
                <button onClick={() => handleAdd(pokemon)}>
                  Agregar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonSearchPopup;