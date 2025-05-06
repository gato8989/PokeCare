import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PokemonDaycare from './components/PokemonDaycare';
import './App.css';

function App() {
  const [pokemons, setPokemons] = useState([]);
  
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <title>PokeCare</title>
        <header className="app-header">
          <h1>Guardería Pokémon</h1>
        </header>
        
        <div className="main-content">
          <PokemonDaycare 
            pokemons={pokemons} 
            onRemovePokemon={removePokemon} 
            onMovePokemon={movePokemon}
            onAddPokemon={addPokemon}
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
