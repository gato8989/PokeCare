/**
 * Servicio de Pokémon para PokeCare
 * 
 * Este microservicio gestiona los datos de Pokémon, incluyendo:
 * - Búsqueda y recuperación de datos de la PokeAPI
 * - Almacenamiento en caché de datos frecuentemente utilizados
 * - Gestión de información personalizada de Pokémon
 */

import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { createClient } from 'redis';
import { MongoClient } from 'mongodb';
import * as promClient from 'prom-client';

const app = express();
const port = 8080;
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Configuración de métricas para Prometheus
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Métricas personalizadas
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de las solicitudes HTTP en segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const pokemonRequestsCounter = new promClient.Counter({
  name: 'pokemon_requests_total',
  help: 'Contador de solicitudes de Pokémon',
  labelNames: ['pokemon_id']
});

register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(pokemonRequestsCounter);

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para medir la duración de las solicitudes
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode });
  });
  next();
});

// Conexión a Redis
let redisClient;
const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: `redis://:password@localhost:6379`
    });
    
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    await redisClient.connect();
    console.log('Conectado a Redis');
  } catch (error) {
    console.error('Error al conectar a Redis:', error);
  }
};

// Conexión a MongoDB
let db;
const connectMongo = async () => {
  try {
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    db = client.db('pokecare');
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
};

// Iniciar conexiones
connectRedis();
connectMongo();

// Rutas
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Obtener un Pokémon por ID o nombre
app.get('/pokemon/:idOrName', async (req, res) => {
  const { idOrName } = req.params;
  
  try {
    // Incrementar contador de métricas
    pokemonRequestsCounter.inc({ pokemon_id: idOrName });
    
    // Verificar caché en Redis
    let pokemonData;
    if (redisClient && redisClient.isReady) {
      const cachedData = await redisClient.get(`pokemon:${idOrName}`);
      if (cachedData) {
        pokemonData = JSON.parse(cachedData);
        return res.json(pokemonData);
      }
    }
    
    // Si no está en caché, consultar la API
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${idOrName}`);
    pokemonData = response.data;
    
    // Guardar en caché
    if (redisClient && redisClient.isReady) {
      await redisClient.set(`pokemon:${idOrName}`, JSON.stringify(pokemonData), {
        EX: 3600 // Expirar en 1 hora
      });
    }
    
    // Guardar registro de búsqueda en MongoDB
    if (db) {
      await db.collection('pokemon_searches').insertOne({
        pokemon_id: idOrName,
        timestamp: new Date(),
        data: { id: pokemonData.id, name: pokemonData.name }
      });
    }
    
    res.json(pokemonData);
  } catch (error) {
    console.error(`Error al obtener Pokémon ${idOrName}:`, error);
    res.status(error.response?.status || 500).json({
      error: 'Error al obtener datos del Pokémon',
      details: error.response?.data || error.message
    });
  }
});

// Listar Pokémon con paginación
app.get('/pokemon', async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;
  
  try {
    // Verificar caché
    let pokemonList;
    const cacheKey = `pokemon:list:${limit}:${offset}`;
    
    if (redisClient && redisClient.isReady) {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        pokemonList = JSON.parse(cachedData);
        return res.json(pokemonList);
      }
    }
    
    // Consultar API
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    pokemonList = response.data;
    
    // Guardar en caché
    if (redisClient && redisClient.isReady) {
      await redisClient.set(cacheKey, JSON.stringify(pokemonList), {
        EX: 3600 // Expirar en 1 hora
      });
    }
    
    res.json(pokemonList);
  } catch (error) {
    console.error('Error al listar Pokémon:', error);
    res.status(error.response?.status || 500).json({
      error: 'Error al listar Pokémon',
      details: error.response?.data || error.message
    });
  }
});

// Obtener estadísticas de búsqueda de Pokémon
app.get('/stats/popular', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Base de datos no disponible' });
    }
    
    const popularPokemon = await db.collection('pokemon_searches')
      .aggregate([
        { $group: { _id: "$pokemon_id", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
      .toArray();
    
    res.json(popularPokemon);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      details: error.message
    });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servicio de Pokémon escuchando en el puerto ${port}`);
});

export default app;

// Manejo de señales para cierre graceful
// Nota: Este código se ejecutará en un entorno de servidor Node.js
// No es necesario en el entorno del navegador
/*
document.addEventListener('beforeunload', async () => {
  console.log('Cerrando conexiones...');
  if (redisClient) await redisClient.quit();
});
*/