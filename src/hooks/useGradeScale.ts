import { useState, useMemo, useCallback } from 'react';
import type { GradeScaleConfig, ScaleDataPoint } from '../types';

/**
 * Valida que la configuración esté en rangos válidos
 * Retorna objeto con errores si hay, vacío si todo está bien
 */
const validateConfig = (config: GradeScaleConfig): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (config.puntajeMaximo <= 0) {
    errors.puntajeMaximo = 'Puntaje máximo debe ser mayor a 0';
  }

  if (config.exigencia < 0 || config.exigencia > 100) {
    errors.exigencia = 'Exigencia debe estar entre 0% y 100%';
  }

  if (config.notaMinima >= config.notaMaxima) {
    errors.notaMinima = 'Nota mínima debe ser menor a nota máxima';
  }

  if (config.notaAprobacion < config.notaMinima || config.notaAprobacion > config.notaMaxima) {
    errors.notaAprobacion = `Nota de aprobación debe estar entre ${config.notaMinima} y ${config.notaMaxima}`;
  }

  if (config.incremento <= 0 || config.incremento > config.puntajeMaximo) {
    errors.incremento = 'Incremento debe estar entre 0 (exclusivo) y puntaje máximo';
  }

  return errors;
};

/**
 * Custom hook para gestionar la escala de calificación chilena
 * Implementa la fórmula oficial de dos segmentos:
 * - Tramo reprobatorio: nota = nmin + (napr - nmin) × (puntaje / puntajeAprobacion)
 * - Tramo aprobatorio: nota = napr + (nmax - napr) × ((puntaje - puntajeAprobacion) / (pmax - puntajeAprobacion))
 */
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

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const updateConfig = useCallback((newConfig: Partial<GradeScaleConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    const errors = validateConfig(updatedConfig);
    
    setValidationErrors(errors);
    
    // Solo actualiza si no hay errores de validación
    if (Object.keys(errors).length === 0) {
      setConfig(updatedConfig);
    }
  }, [config]);

  const resetToDefaults = useCallback(() => {
    const defaultConfig: GradeScaleConfig = {
      puntajeMaximo: 100,
      exigencia: 60,
      notaMinima: 1.0,
      notaMaxima: 7.0,
      notaAprobacion: 4.0,
      incremento: 1.0,
      orden: 'asc'
    };
    setConfig(defaultConfig);
    setValidationErrors({});
  }, []);

  /**
   * Calcula la escala de notas basada en la configuración actual
   * Implementa la fórmula chilena oficial de dos segmentos
   */
  const scaleData = useMemo(() => {
    const { puntajeMaximo, exigencia, notaMinima, notaMaxima, notaAprobacion, incremento, orden } = config;
    
    // Convertir exigencia de porcentaje a decimal (ej: 60% → 0.6)
    const e = exigencia / 100;
    
    // Puntaje necesario para obtener nota de aprobación
    const puntajeAprobacion = puntajeMaximo * e;
    
    const data: ScaleDataPoint[] = [];
    
    // Generar tabla de conversión
    for (let puntaje = 0; puntaje <= puntajeMaximo; puntaje += incremento) {
      let nota: number;
      
      if (puntaje < puntajeAprobacion) {
        // TRAMO REPROBATORIO: Escala desde notaMinima hasta notaAprobacion
        // Fórmula: nota = nmin + (napr - nmin) × (puntaje / puntajeAprobacion)
        // Esto asegura que en puntaje=0 → nota=nmin, y en puntaje=puntajeAprobacion → nota=napr
        nota = notaMinima + (notaAprobacion - notaMinima) * (puntaje / puntajeAprobacion);
      } else {
        // TRAMO APROBATORIO: Escala desde notaAprobacion hasta notaMaxima
        // Fórmula: nota = napr + (nmax - napr) × ((puntaje - puntajeAprobacion) / (puntajeMaximo - puntajeAprobacion))
        // Esto asegura que en puntaje=puntajeAprobacion → nota=napr, y en puntaje=pmax → nota=nmax
        const puntajeSobreAprobacion = puntaje - puntajeAprobacion;
        const puntajeMaximoSobreAprobacion = puntajeMaximo - puntajeAprobacion;
        nota = notaAprobacion + (notaMaxima - notaAprobacion) * (puntajeSobreAprobacion / puntajeMaximoSobreAprobacion);
      }
      
      // Redondear a 1 decimal con precisión
      nota = Math.round(nota * 10) / 10;
      
      // Asegurar que siempre está en el rango válido [notaMinima, notaMaxima]
      nota = Math.max(notaMinima, Math.min(notaMaxima, nota));
      
      data.push({ puntaje, nota });
    }
    
    // Aplicar orden (ascendente o descendente)
    if (orden === 'desc') {
      data.reverse();
    }
    
    return data;
  }, [config]);

  /**
   * Organiza los datos en columnas para mostrar horizontalmente
   * Distribuye items equitativamente entre columnas (máximo 10 columnas)
   */
  const tableColumns = useMemo(() => {
    const maxColumns = 10;
    const columnCount = Math.min(maxColumns, Math.ceil(scaleData.length / 10));
    const itemsPerColumn = Math.ceil(scaleData.length / columnCount);
    
    const columns: Array<ScaleDataPoint[]> = [];
    
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
    resetToDefaults,
    scaleData,
    tableColumns,
    validationErrors,
    isValid: Object.keys(validationErrors).length === 0
  };
};
