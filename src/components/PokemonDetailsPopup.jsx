import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'material-symbols';

const PokemonDetailsPopup = ({ pokemonId, onClose }) => {
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        setPokemonDetails(response.data);
      } catch (err) {
        setError('Error al cargar los detalles del Pokémon');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [pokemonId]);

  if (loading) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-pokemon p-6 flex items-center">
        <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
        <p>Cargando...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-pokemon p-6 text-red-500 flex items-center">
        <span className="material-symbols-outlined mr-2">error</span>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-pokemon p-4 sm:p-6 w-full max-w-md shadow-lg max-h-[80vh] overflow-y-auto relative">
        <div className="sticky top-0 flex justify-end bg-white py-2 z-10">
          <button 
            className="text-red-500 hover:text-red-700 text-2xl focus:outline-none bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors" 
            onClick={onClose}
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="text-center mb-4">
          <img 
            src={pokemonDetails.sprites.other['official-artwork'].front_default || 
                 pokemonDetails.sprites.front_default} 
            alt={pokemonDetails.name}
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto object-contain transition-transform hover:scale-105"
            loading="lazy"
          />
          <h2 className="text-xl sm:text-2xl font-bold capitalize text-gray-800 mt-2">{pokemonDetails.name}</h2>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {pokemonDetails.types.map((type, index) => {
              const typeColors = {
                normal: 'bg-gray-400',
                fire: 'bg-red-500',
                water: 'bg-blue-500',
                electric: 'bg-yellow-400',
                grass: 'bg-green-500',
                ice: 'bg-blue-200',
                fighting: 'bg-red-700',
                poison: 'bg-purple-500',
                ground: 'bg-yellow-600',
                flying: 'bg-indigo-300',
                psychic: 'bg-pink-500',
                bug: 'bg-green-400',
                rock: 'bg-yellow-700',
                ghost: 'bg-purple-700',
                dragon: 'bg-indigo-600',
                dark: 'bg-gray-800',
                steel: 'bg-gray-500',
                fairy: 'bg-pink-300',
              };
              return (
                <span 
                  key={index} 
                  className={`${typeColors[type.type.name] || 'bg-gray-400'} text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm capitalize`}
                >
                  {type.type.name}
                </span>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <span className="material-symbols-outlined mr-2">monitoring</span>
            Estadísticas
          </h3>
          <div className="space-y-2">
            {pokemonDetails.stats.map((stat, index) => {
              const statNames = {
                'hp': 'HP',
                'attack': 'Ataque',
                'defense': 'Defensa',
                'special-attack': 'Atq. Esp.',
                'special-defense': 'Def. Esp.',
                'speed': 'Velocidad'
              };
              const statColors = {
                'hp': 'bg-red-500',
                'attack': 'bg-orange-500',
                'defense': 'bg-yellow-500',
                'special-attack': 'bg-blue-500',
                'special-defense': 'bg-green-500',
                'speed': 'bg-pink-500'
              };
              return (
                <div key={index} className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{statNames[stat.stat.name] || stat.stat.name}</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${statColors[stat.stat.name] || 'bg-blue-500'} h-2 rounded-full transition-all duration-300`} 
                      style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <span className="material-symbols-outlined mr-2">auto_awesome</span>
            Habilidades
          </h3>
          <div className="flex flex-wrap gap-2">
            {pokemonDetails.abilities.map((ability, index) => (
              <span key={index} className="bg-pokemon-blue bg-opacity-20 text-pokemon-blue px-2 py-1 rounded-full text-xs sm:text-sm capitalize">
                {ability.ability.name.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailsPopup;