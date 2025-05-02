import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  if (loading) return <div className="popup-loading">Cargando...</div>;
  if (error) return <div className="popup-error">{error}</div>;

  return (
    <div className="pokemon-details-popup">
      <button className="close-popup" onClick={onClose}>×</button>
      
      <div className="pokemon-header">
        <img 
          src={pokemonDetails.sprites.other['official-artwork'].front_default || 
               pokemonDetails.sprites.front_default} 
          alt={pokemonDetails.name}
          className="pokemon-detail-image"
        />
        <h2 className="pokemon-name">{pokemonDetails.name}</h2>
        <div className="pokemon-types">
          {pokemonDetails.types.map((type, index) => (
            <span key={index} className={`type-badge type-${type.type.name}`}>
              {type.type.name}
            </span>
          ))}
        </div>
      </div>

      <div className="pokemon-stats">
        <h3>Estadísticas</h3>
        <div className="stats-grid">
          {pokemonDetails.stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-name">{stat.stat.name}</span>
              <div className="stat-bar-container">
                <div 
                  className="stat-bar" 
                  style={{ width: `${Math.min(100, stat.base_stat)}%` }}
                ></div>
                <span className="stat-value">{stat.base_stat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pokemon-abilities">
        <h3>Habilidades</h3>
        <div className="abilities-list">
          {pokemonDetails.abilities.map((ability, index) => (
            <span key={index} className="ability-badge">
              {ability.ability.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailsPopup;