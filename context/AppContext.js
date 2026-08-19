import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [votantes, setVotantes] = useState([]);
  const [coordinadores, setCoordinadores] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const v = await AsyncStorage.getItem('votantes');
      const c = await AsyncStorage.getItem('coordinadores');
      if (v) setVotantes(JSON.parse(v));
      if (c) setCoordinadores(JSON.parse(c));
    } catch (e) {}
    setLoaded(true);
  }

  async function agregarVotante(votante) {
    const nuevo = {
      ...votante,
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      estado: 'inscrito',
    };
    const nuevos = [...votantes, nuevo];
    setVotantes(nuevos);
    await AsyncStorage.setItem('votantes', JSON.stringify(nuevos));
    return nuevo;
  }

  async function actualizarVotante(id, cambios) {
    const nuevos = votantes.map(v => v.id === id ? { ...v, ...cambios } : v);
    setVotantes(nuevos);
    await AsyncStorage.setItem('votantes', JSON.stringify(nuevos));
  }

  async function agregarCoordinador(coord) {
    const nuevo = { ...coord, id: Date.now().toString() };
    const nuevos = [...coordinadores, nuevo];
    setCoordinadores(nuevos);
    await AsyncStorage.setItem('coordinadores', JSON.stringify(nuevos));
  }

  const stats = {
    inscritos: votantes.length,
    afiliados: votantes.filter(v => v.estado === 'afiliado').length,
    noAfiliados: votantes.filter(v => v.estado === 'no_afiliado').length,
    pendientes: votantes.filter(v => v.estado === 'inscrito').length,
    promotores: [...new Set(votantes.map(v => v.promotor).filter(Boolean))].length,
  };

  return (
    <AppContext.Provider value={{
      votantes, coordinadores, stats, loaded,
      agregarVotante, actualizarVotante, agregarCoordinador
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
