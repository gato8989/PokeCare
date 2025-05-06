import React, { useState, useEffect } from 'react';
import PokemonCard from './PokemonCard';
import PokemonSearchPopup from './PokemonSearchPopup';
import { IoIosAddCircleOutline } from 'react-icons/io';
import DaycareSearch from './DaycareSearch';
import PokemonDetailsPopup from './PokemonDetailsPopup';

const PokemonDaycare = ({ pokemons, onRemovePokemon, onMovePokemon, onAddPokemon }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState([...pokemons]);

  // Efecto principal para sincronización
  useEffect(() => {
    const filtered = searchTerm 
      ? pokemons.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : [...pokemons];
    setFilteredPokemons(filtered);
  }, [pokemons, searchTerm]);

  // Función para agregar nuevo Pokémon
  const handleAddPokemon = (pokemon) => {
    onAddPokemon(pokemon); // Actualiza la lista principal
    setSearchTerm(''); // Resetea el filtro
    setShowPopup(false);
  };

  return (
    <div className="daycare-container">
      <div className="daycare-header">
        <div className="header-top-row">
          <h2>Guardería ({pokemons.length})</h2>
          <button 
            className="add-pokemon-btn"
            onClick={() => setShowPopup(true)}
            title="Agregar Pokémon"
          >
            <IoIosAddCircleOutline className='add-icon'/> 
          </button>
        </div>

        <DaycareSearch onSearch={setSearchTerm} currentSearch={searchTerm} />
      </div>

      {showPopup && (
        <PokemonSearchPopup
          onAddPokemon={handleAddPokemon}
          onClose={() => setShowPopup(false)}
        />
      )}

      {showAddPopup && (
        <PokemonSearchPopup
          onAddPokemon={(pokemon) => {
            onAddPokemon(pokemon);
            setShowAddPopup(false);
          }}
          onClose={() => setShowAddPopup(false)}
        />
      )}

      {selectedPokemonId && (
        <PokemonDetailsPopup
          pokemonId={selectedPokemonId}
          onClose={() => setSelectedPokemonId(null)}
        />
      )}

      <div className="daycare-grid">
        {filteredPokemons.length === 0 ? (
          <p className="no-results">
            {pokemons.length === 0 
              ? 'No hay Pokémon en la guardería. ¡Agrega algunos!' 
              : 'No se encontraron Pokémon que coincidan con la búsqueda'}
          </p>
        ) : (
          filteredPokemons.map((pokemon, index) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              index={index}
              onRemove={onRemovePokemon}
              onMove={onMovePokemon}
              onClick={setSelectedPokemonId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PokemonDaycare;