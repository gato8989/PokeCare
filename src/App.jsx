import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PokemonDaycare from './components/PokemonDaycare';
import 'material-symbols/rounded.css';
import useLocalStorage from './hooks/useLocalStorage';
import './styles/darkMode.css';

function App() {
  // Usar localStorage para persistir los Pokémon entre sesiones
  const [pokemons, setPokemons] = useLocalStorage('pokemons', []);
  // Estado para el modo oscuro
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  // Estado para filtros avanzados
  const [filters, setFilters] = useState({
    type: '',
    minLevel: 0,
    maxLevel: 100,
    sortBy: 'id'
  });
  
  const addPokemon = (pokemonData) => {
    if (pokemons.some(p => p.id === pokemonData.id)) {
      alert('Este Pokémon ya está en la guardería');
      return;
    }
    
    setPokemons(prev => [...prev, {
      ...pokemonData,
      // Asegurar que siempre tenga un nickname
      nickname: pokemonData.name
    }]);
  };


  const removePokemon = (id) => {
    setPokemons(pokemons.filter(pokemon => pokemon.id !== id));
  };

  const movePokemon = (dragIndex, hoverIndex) => {
    const draggedPokemon = pokemons[dragIndex];
    const updatedPokemons = [...pokemons];
    updatedPokemons.splice(dragIndex, 1);
    updatedPokemons.splice(hoverIndex, 0, draggedPokemon);
    setPokemons(updatedPokemons);
  };

  // Efecto para aplicar el modo oscuro al body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Función para alternar el modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Función para aplicar filtros
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark-bg' : 'bg-gradient-to-b from-pokemon-light-blue/10 to-pokemon-light-yellow/20'} p-6`}>
        <header className="text-center py-8 mb-10">
          <div className="flex justify-end mb-4">
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'} transition-colors duration-300`}
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              <span className="material-symbols-rounded">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
          <h1 className={`text-5xl font-bold ${darkMode ? 'text-white' : 'text-pokemon-blue'} flex items-center justify-center transition-all duration-300 hover:scale-105`}>
            <span className="material-symbols-rounded text-pokemon-yellow mr-3 text-4xl animate-pulse-slow">pets</span>
            Guardería Pokémon
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-pokemon-gray'} mt-4 max-w-xl mx-auto`}>Cuida y organiza tus Pokémon favoritos en un solo lugar</p>
        </header>
        
        <div className="container mx-auto px-4">
          <PokemonDaycare 
            pokemons={pokemons} 
            onRemovePokemon={removePokemon} 
            onMovePokemon={movePokemon}
            onAddPokemon={addPokemon}
            darkMode={darkMode}
            filters={filters}
            onApplyFilters={applyFilters}
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;