import { onValue, ref, remove, set, update } from 'firebase/database';
import { useEffect, useState, useRef } from 'react';
import { db } from '../api/firebaseConfig';

export const useFeeder = () => {
  const [data, setData] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  // Usamos una referencia para guardar el último latido sin romper el useEffect
  const ultimoLatidoRef = useRef(0);
  const chequeoTimerRef = useRef(null);

  useEffect(() => {
    // Apuntar a la ruta correcta '/dispensador'
    const feederRef = ref(db, '/dispensador');
    
    const unsubscribe = onValue(feederRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setData(val);
        setLoading(false);

        // --- LÓGICA DE LATIDO INTELIGENTE ---
        if (val && val.latido !== undefined) {
          // Si el latido que viene de Firebase es diferente al que teníamos guardado, el ESP32 está vivo
          if (val.latido !== ultimoLatidoRef.current) {
            ultimoLatidoRef.current = val.latido; // actualizamos nuestra copia
            setIsOnline(true);

            // Iniciar cronómetro: si en 12 segundos no hay un latido nuevo, se declara muerto
            clearTimeout(chequeoTimerRef.current);
            chequeoTimerRef.current = setTimeout(() => {
              setIsOnline(false);
            }, 12000);
          }
        }
      } else {
        setLoading(false);
      }
    });

    // Limpieza al cerrar la aplicación
    return () => {
      unsubscribe();
      clearTimeout(chequeoTimerRef.current);
    };
  }, []); // Array vacío para que SOLO se ejecute una vez al abrir la app y no haga bucles

  // --- CONTROLES GENERALES ---
  const togglePower = () => {
    if (!data) return;
    update(ref(db, '/dispensador'), { 
      estadoDispensador: !data.estadoDispensador 
    });
  };

  const manualFeed = () => {
    if (!data || !data.estadoDispensador) return;
    update(ref(db, '/dispensador'), { 
      alimentarManual: true 
    });
  };

  // --- GESTIÓN DE HORARIOS ---
  const addSchedule = (time) => {
    // time debe venir en formato "HH:MM" (ej: "15:30")
    set(ref(db, `/dispensador/horarios/${time}`), true);
  };

  const removeSchedule = (time) => {
    remove(ref(db, `/dispensador/horarios/${time}`));
  };

  return { data, isOnline, loading, togglePower, manualFeed, addSchedule, removeSchedule };
};