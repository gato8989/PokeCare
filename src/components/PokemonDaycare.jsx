import React, { useState, useEffect } from 'react';
import PokemonCard from './PokemonCard';
import PokemonSearchPopup from './PokemonSearchPopup';
import DaycareSearch from './DaycareSearch';
import PokemonDetailsPopup from './PokemonDetailsPopup';
import 'material-symbols/rounded.css';

// Función para obtener el color de fondo según el tipo de Pokémon
const getTypeColor = (type) => {
  const typeColors = {
    normal: 'bg-[#A8A878]',
    fire: 'bg-[#F08030]',
    water: 'bg-[#6890F0]',
    electric: 'bg-[#F8D030]',
    grass: 'bg-[#78C850]',
    ice: 'bg-[#98D8D8]',
    fighting: 'bg-[#C03028]',
    poison: 'bg-[#A040A0]',
    ground: 'bg-[#E0C068]',
    flying: 'bg-[#A890F0]',
    psychic: 'bg-[#F85888]',
    bug: 'bg-[#A8B820]',
    rock: 'bg-[#B8A038]',
    ghost: 'bg-[#705898]',
    dragon: 'bg-[#7038F8]',
    dark: 'bg-[#705848]',
    steel: 'bg-[#B8B8D0]',
    fairy: 'bg-[#EE99AC]'
  };
  
  return typeColors[type] || 'bg-gray-500';
};

const PokemonDaycare = ({ pokemons, onRemovePokemon, onMovePokemon, onAddPokemon, darkMode, filters, onApplyFilters }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState([...pokemons]);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Efecto principal para sincronización con búsqueda y filtros
  useEffect(() => {
    let filtered = [...pokemons];
    
    // Aplicar búsqueda por texto
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Aplicar filtros avanzados
    if (filters.type) {
      filtered = filtered.filter(p => 
        p.types && p.types.some(type => type.type.name === filters.type)
      );
    }
    
    // Ordenar según criterio seleccionado
    if (filters.sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'id') {
      filtered.sort((a, b) => a.id - b.id);
    }
    
    setFilteredPokemons(filtered);
  }, [pokemons, searchTerm, filters]);

  // Función para agregar nuevo Pokémon
  const handleAddPokemon = (pokemon) => {
    onAddPokemon(pokemon); // Actualiza la lista principal
    setSearchTerm(''); // Resetea el filtro
    setShowPopup(false);
  };

  // Función para manejar cambios en los filtros locales
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para aplicar los filtros
  const applyLocalFilters = () => {
    onApplyFilters(localFilters);
    setShowFilters(false);
  };

  // Calcular estadísticas de los Pokémon
  const calculateStats = () => {
    if (pokemons.length === 0) return null;
    
    const types = {};
    let totalPokemon = pokemons.length;
    
    pokemons.forEach(pokemon => {
      if (pokemon.types) {
        pokemon.types.forEach(typeInfo => {
          const typeName = typeInfo.type.name;
          types[typeName] = (types[typeName] || 0) + 1;
        });
      }
    });
    
    return { types, totalPokemon };
  };

  const stats = calculateStats();

  return (
    <div className={`${darkMode ? 'dark-popup' : 'bg-daycare-bg bg-pokemon-pattern'} p-8 rounded-2xl shadow-pokemon max-w-5xl mx-auto border ${darkMode ? 'border-gray-700' : 'border-pokemon-light-gray'}`}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-pokemon-dark-blue'} flex items-center`}>
            <span className="material-symbols-rounded mr-3 text-pokemon-yellow animate-pulse-slow">pets</span>
            Guardería <span className="ml-3 bg-pokemon-blue text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">{pokemons.length}</span>
          </h2>
          <div className="flex gap-2">
            <button 
              className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-pokemon-blue hover:bg-pokemon-light-blue'} text-white p-3 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md`}
              onClick={() => setShowStats(!showStats)}
              title="Estadísticas"
            >
              <span className="material-symbols-rounded">bar_chart</span>
            </button>
            <button 
              className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-pokemon-blue hover:bg-pokemon-light-blue'} text-white p-3 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md`}
              onClick={() => setShowFilters(!showFilters)}
              title="Filtros"
            >
              <span className="material-symbols-rounded">filter_alt</span>
            </button>
            <button 
              className={`${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-pokemon-green hover:bg-pokemon-light-green'} text-white p-3 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md`}
              onClick={() => setShowPopup(true)}
              title="Agregar Pokémon"
            >
              <span className="material-symbols-rounded">add</span>
            </button>
          </div>
        </div>

        <DaycareSearch onSearch={setSearchTerm} currentSearch={searchTerm} darkMode={darkMode} />
        
        {/* Filtros avanzados */}
        {showFilters && (
          <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'dark-stats' : 'bg-white'} shadow-md`}>
            <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-pokemon-dark-blue'}`}>Filtros avanzados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tipo</label>
                <select 
                  name="type" 
                  value={localFilters.type} 
                  onChange={handleFilterChange}
                  className={`w-full p-2 rounded-lg ${darkMode ? 'dark-input' : 'border border-gray-300'}`}
                >
                  <option value="">Todos los tipos</option>
                  <option value="normal">Normal</option>
                  <option value="fire">Fuego</option>
                  <option value="water">Agua</option>
                  <option value="electric">Eléctrico</option>
                  <option value="grass">Planta</option>
                  <option value="ice">Hielo</option>
                  <option value="fighting">Lucha</option>
                  <option value="poison">Veneno</option>
                  <option value="ground">Tierra</option>
                  <option value="flying">Volador</option>
                  <option value="psychic">Psíquico</option>
                  <option value="bug">Bicho</option>
                  <option value="rock">Roca</option>
                  <option value="ghost">Fantasma</option>
                  <option value="dragon">Dragón</option>
                  <option value="dark">Siniestro</option>
                  <option value="steel">Acero</option>
                  <option value="fairy">Hada</option>
                </select>
              </div>
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ordenar por</label>
                <select 
                  name="sortBy" 
                  value={localFilters.sortBy} 
                  onChange={handleFilterChange}
                  className={`w-full p-2 rounded-lg ${darkMode ? 'dark-input' : 'border border-gray-300'}`}
                >
                  <option value="id">Número</option>
                  <option value="name">Nombre</option>
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={applyLocalFilters}
                  className={`w-full p-2 rounded-lg ${darkMode ? 'bg-pokemon-blue text-white' : 'bg-pokemon-blue text-white'} hover:opacity-90`}
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Estadísticas */}
        {showStats && stats && (
          <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'dark-stats' : 'bg-white'} shadow-md`}>
            <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-pokemon-dark-blue'}`}>Estadísticas de la guardería</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className={`text-md font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Distribución por tipo</h4>
                <div className="space-y-2">
                  {Object.entries(stats.types).map(([type, count]) => (
                    <div key={type} className="flex items-center">
                      <div className={`w-24 capitalize ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{type}</div>
                      <div className="flex-grow h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getTypeColor(type)}`}
                          style={{ width: `${(count / stats.totalPokemon) * 100}%` }}
                        ></div>
                      </div>
                      <div className="ml-2 text-sm">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className={`text-md font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Resumen</h4>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total de Pokémon: {stats.totalPokemon}</p>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tipos diferentes: {Object.keys(stats.types).length}</p>
              </div>
            </div>
          </div>
        )}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPokemons.length === 0 ? (
          <div className="col-span-full p-8 text-center">
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} flex flex-col items-center justify-center`}>
              <span className="material-symbols-rounded text-5xl mb-4">
                {pokemons.length === 0 ? 'pets' : 'search_off'}
              </span>
              {pokemons.length === 0 
                ? 'No hay Pokémon en la guardería. ¡Agrega algunos!' 
                : 'No se encontraron Pokémon que coincidan con la búsqueda'}
            </p>
          </div>
        ) : (
          filteredPokemons.map((pokemon, index) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              index={index}
              onRemove={onRemovePokemon}
              onMove={onMovePokemon}
              onClick={setSelectedPokemonId}
              darkMode={darkMode}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PokemonDaycare;