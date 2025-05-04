import React, { useState } from 'react';
import axios from 'axios';
import 'material-symbols/rounded.css';

// Función para obtener la clase CSS según el tipo de Pokémon
const getTypeClass = (type) => {
  const typeClasses = {
    normal: 'bg-[#A8A878] text-white',
    fire: 'bg-[#F08030] text-white',
    water: 'bg-[#6890F0] text-white',
    electric: 'bg-[#F8D030] text-black',
    grass: 'bg-[#78C850] text-white',
    ice: 'bg-[#98D8D8] text-black',
    fighting: 'bg-[#C03028] text-white',
    poison: 'bg-[#A040A0] text-white',
    ground: 'bg-[#E0C068] text-black',
    flying: 'bg-[#A890F0] text-white',
    psychic: 'bg-[#F85888] text-white',
    bug: 'bg-[#A8B820] text-white',
    rock: 'bg-[#B8A038] text-white',
    ghost: 'bg-[#705898] text-white',
    dragon: 'bg-[#7038F8] text-white',
    dark: 'bg-[#705848] text-white',
    steel: 'bg-[#B8B8D0] text-black',
    fairy: 'bg-[#EE99AC] text-black'
  };
  
  return typeClasses[type] || 'bg-gray-500 text-white';
};

const PokemonSearchPopup = ({ onAddPokemon, onClose, darkMode }) => {
  // Si no se proporciona darkMode, usar false como valor predeterminado
  const isDarkMode = darkMode !== undefined ? darkMode : false;
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchPokemon = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      // Intentar buscar por nombre o ID exacto primero
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      setSearchResults([response.data]);
    } catch (error) {
      // Registrar el error en la consola para depuración
      console.error('Error al buscar Pokémon específico:', error);
      try {
        // Si no se encuentra, intentar buscar en la lista de Pokémon
        const listResponse = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const matchingPokemon = listResponse.data.results.filter(p => 
          p.name.includes(searchTerm.toLowerCase())
        );
        
        if (matchingPokemon.length > 0) {
          // Obtener detalles de los primeros 5 Pokémon que coincidan
          const detailPromises = matchingPokemon.slice(0, 5).map(p => 
            axios.get(p.url)
          );
          const detailResponses = await Promise.all(detailPromises);
          setSearchResults(detailResponses.map(res => res.data));
        } else {
          setSearchResults([]);
          // Usar un mensaje más amigable en lugar de alert
          setSearchError('No se encontraron Pokémon con ese nombre');
        }
      } catch (listError) {
        console.error('Error al buscar en la lista de Pokémon:', listError);
        setSearchResults([]);
        setSearchError('Error al buscar Pokémon. Inténtalo de nuevo.');
      }
    } finally {
      setIsSearching(false);
    }
  };
  
  // Estado para manejar errores de búsqueda
  const [searchError, setSearchError] = useState('');

  const handleAdd = (pokemon) => {
    onAddPokemon({
      id: pokemon.id,
      name: pokemon.name,
      sprites: pokemon.sprites,
      types: pokemon.types, // Agregar los tipos para mostrarlos en la tarjeta
    });
    // Limpiar todos los estados
    setSearchTerm('');
    setSearchResults([]);
    setSearchError('');
  };
  
  // Función para limpiar todos los estados cuando se cierra el popup
  const handleClose = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSearchError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title">
      <div className={`${isDarkMode ? 'dark-popup' : 'bg-white'} rounded-pokemon p-8 w-full max-w-md shadow-pokemon border ${isDarkMode ? 'border-gray-700' : 'border-pokemon-light-gray'} animate-fadeIn transition-colors duration-300`}>
        <div className="flex justify-between items-center mb-6">
          <h3 id="search-dialog-title" className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-pokemon-dark-blue'}`}>Buscar Pokémon</h3>
          <button 
            className={`${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-pokemon-gray hover:text-pokemon-red'} text-2xl focus:outline-none transition-colors`} 
            onClick={handleClose}
            aria-label="Cerrar búsqueda"
          >
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>
        
        <div className="flex mb-6" role="search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchError(''); // Limpiar error al cambiar la búsqueda
            }}
            placeholder="Nombre o número"
            onKeyPress={(e) => e.key === 'Enter' && searchPokemon()}
            className={`flex-grow px-4 py-3 ${isDarkMode ? 'dark-input border-gray-700' : 'border border-pokemon-light-gray'} rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue shadow-sm transition-colors duration-300`}
            aria-label="Buscar Pokémon por nombre o número"
            autoFocus
          />
          <button 
            onClick={searchPokemon} 
            disabled={isSearching}
            className={`${isDarkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-pokemon-blue hover:bg-pokemon-light-blue'} text-white px-5 py-3 rounded-r-lg disabled:opacity-50 flex items-center transition-all duration-300 shadow-sm`}
            aria-label="Iniciar búsqueda"
          >
            <span className="material-symbols-rounded mr-2" aria-hidden="true">search</span>
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        
        {/* Mensaje de error */}
        {searchError && (
          <div className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-red-900' : 'bg-red-100'} ${isDarkMode ? 'text-red-200' : 'text-red-700'} flex items-center`} role="alert">
            <span className="material-symbols-rounded mr-2">error</span>
            {searchError}
          </div>
        )}
        
        {/* Resultados de búsqueda */}
        {searchResults.length > 0 && (
          <div 
            className={`mt-6 max-h-96 overflow-y-auto rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-pokemon-light-gray'}`}
            aria-live="polite"
            aria-label={`${searchResults.length} Pokémon encontrados`}
          >
            {searchResults.map((pokemon) => (
              <div 
                key={pokemon.id} 
                className={`flex items-center p-4 border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-pokemon-light-gray hover:bg-pokemon-light-gray'} bg-opacity-50 transition-colors duration-300`}
              >
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-full p-1 mr-3 shadow-sm`}>
                  <img 
                    src={pokemon.sprites.front_default} 
                    alt={`Imagen de ${pokemon.name}`} 
                    className={`w-16 h-16 object-contain ${isDarkMode ? 'dark-float' : 'animate-float'}`}
                    loading="lazy"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className={`capitalize text-lg font-bold ${isDarkMode ? 'text-white' : 'text-pokemon-dark-blue'}`}>{pokemon.name}</h4>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-pokemon-gray'} text-sm`}>#{pokemon.id}</p>
                  {pokemon.types && (
                    <div className="flex mt-1 gap-1" aria-label="Tipos">
                      {pokemon.types.map(typeInfo => (
                        <span 
                          key={typeInfo.type.name}
                          className={`text-xs px-2 py-1 rounded-full capitalize ${getTypeClass(typeInfo.type.name)}`}
                        >
                          {typeInfo.type.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => handleAdd(pokemon)}
                  className={`${isDarkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-pokemon-green hover:bg-pokemon-light-green'} text-white px-4 py-2 rounded-full flex items-center transition-all duration-300 shadow-sm hover:scale-105 transform`}
                  aria-label={`Agregar ${pokemon.name} a tu guardería`}
                >
                  <span className="material-symbols-rounded mr-1" aria-hidden="true">add</span>
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