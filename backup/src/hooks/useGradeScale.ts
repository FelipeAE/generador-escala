import { useState, useMemo } from 'react';
import type { GradeScaleConfig, ScaleDataPoint } from '../types';

export const useGradeScale = () => {
  const [config, setConfig] = useState<GradeScaleConfig>({
    puntajeMaximo: 100,
    exigencia: 60,
    notaMinima: 1.0,
    notaMaxima: 7.0,
    notaAprobacion: 4.0,
    incremento: 1.0,
    orden: 'asc'
  });

  const updateConfig = (newConfig: Partial<GradeScaleConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const scaleData = useMemo(() => {
    const { puntajeMaximo, exigencia, notaMinima, notaMaxima, notaAprobacion, incremento, orden } = config;
    
    // Fórmula correcta de escala de notas chilenas
    // nmax = nota máxima (7.0)
    // nmin = nota mínima (1.0)  
    // napr = nota aprobación (4.0)
    // e = exigencia como decimal (60% = 0.6)
    // pmax = puntaje máximo (100)
    
    const e = exigencia / 100; // Convertir porcentaje a decimal
    const puntajeAprobacion = puntajeMaximo * e; // Puntaje necesario para aprobar
    
    const data: ScaleDataPoint[] = [];
    
    for (let puntaje = 0; puntaje <= puntajeMaximo; puntaje += incremento) {
      let nota;
      
      if (puntaje < puntajeAprobacion) {
        // Tramo reprobatorio: de nmin a napr
        // Fórmula: nota = nmin + (napr - nmin) * (puntaje / (pmax * e))
        nota = notaMinima + (notaAprobacion - notaMinima) * (puntaje / puntajeAprobacion);
      } else {
        // Tramo aprobatorio: de napr a nmax
        // Fórmula: nota = napr + (nmax - napr) * ((puntaje - pmax*e) / (pmax*(1-e)))
        const puntajeSobreAprobacion = puntaje - puntajeAprobacion;
        const puntajeMaximoSobreAprobacion = puntajeMaximo - puntajeAprobacion;
        nota = notaAprobacion + (notaMaxima - notaAprobacion) * (puntajeSobreAprobacion / puntajeMaximoSobreAprobacion);
      }
      
      // Redondear a 1 decimal con mayor precisión
      nota = Math.round(nota * 10) / 10;
      
      // Asegurar que esté en el rango válido
      nota = Math.max(notaMinima, Math.min(notaMaxima, nota));
      
      data.push({ puntaje, nota });
    }
    
    if (orden === 'desc') {
      data.reverse();
    }
    
    return data;
  }, [config]);

  const tableColumns = useMemo(() => {
    const columnCount = Math.min(10, Math.ceil(scaleData.length / 10));
    const columns = [];
    const itemsPerColumn = Math.ceil(scaleData.length / columnCount);
    
    for (let i = 0; i < columnCount; i++) {
      const startIndex = i * itemsPerColumn;
      const endIndex = Math.min(startIndex + itemsPerColumn, scaleData.length);
      columns.push(scaleData.slice(startIndex, endIndex));
    }
    
    return columns;
  }, [scaleData]);

  return {
    config,
    updateConfig,
    scaleData,
    tableColumns
  };
};