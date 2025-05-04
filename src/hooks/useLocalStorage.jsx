import { useState } from 'react';

/**
 * Hook personalizado para persistir datos en localStorage
 * @param {string} key - Clave para almacenar en localStorage
 * @param {any} initialValue - Valor inicial si no hay datos en localStorage
 * @returns {Array} - [storedValue, setValue] similar a useState
 */
const useLocalStorage = (key, initialValue) => {
  // Estado para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Obtener de localStorage por key
      const item = window.localStorage.getItem(key);
      // Analizar el JSON almacenado o devolver initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay error, devolver initialValue
      console.error(`Error al recuperar ${key} de localStorage:`, error);
      return initialValue;
    }
  });

  // Función para actualizar localStorage y estado
  const setValue = (value) => {
    try {
      // Permitir que value sea una función como en useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Guardar estado
      setStoredValue(valueToStore);
      // Guardar en localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error al guardar ${key} en localStorage:`, error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;