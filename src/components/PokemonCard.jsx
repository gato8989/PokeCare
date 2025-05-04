import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import 'material-symbols/rounded.css';

const PokemonCard = ({ pokemon, index, onRemove, onMove, onClick, darkMode }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'POKEMON',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'POKEMON',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        onMove(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`${darkMode ? 'dark-card' : 'bg-white'} rounded-pokemon p-4 m-2 ${darkMode ? 'shadow-lg' : 'shadow-pokemon'} hover:shadow-card-hover transition-all duration-300 cursor-pointer ${isDragging ? 'opacity-50 scale-95 rotate-1' : 'hover:scale-105'}`}
      onClick={() => onClick(pokemon.id)}
    >
      <div className={`relative ${darkMode ? 'bg-gray-800 bg-opacity-40' : 'bg-pokemon-light-gray bg-opacity-50'} rounded-full p-2 mb-3`}>
        <div className={`${darkMode ? 'dark-float' : 'animate-float'}`}>
          <img 
            src={pokemon.sprites.front_default} 
            alt={pokemon.name} 
            className="w-28 h-28 mx-auto object-contain"
          />
        </div>
        <div className={`absolute top-0 right-0 ${darkMode ? 'bg-gray-700 text-white' : 'bg-pokemon-light-blue text-pokemon-dark-blue'} text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center`}>
          #{pokemon.id}
        </div>
      </div>
      <h3 className={`text-center capitalize font-bold ${darkMode ? 'text-gray-200' : 'text-pokemon-dark-blue'} mb-3`}>{pokemon.name}</h3>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onRemove(pokemon.id);
        }} 
        className={`w-full ${darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-pokemon-red hover:bg-pokemon-light-red'} text-white py-2 px-3 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm transform hover:scale-105`}
      >
        <span className="material-symbols-rounded mr-1 text-sm">logout</span>
        Liberar
      </button>
    </div>
  );
};

export default PokemonCard;