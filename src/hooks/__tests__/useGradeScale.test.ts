import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGradeScale } from '../useGradeScale';

/**
 * Tests unitarios para la lógica de escala de calificación chilena
 * Valida que las fórmulas de dos segmentos funcionen correctamente
 */
describe('useGradeScale - Escala Chilena de Calificación', () => {
  describe('Configuración por defecto', () => {
    it('debe inicializar con valores por defecto correctos', () => {
      const { result } = renderHook(() => useGradeScale());

      expect(result.current.config).toEqual({
        puntajeMaximo: 100,
        exigencia: 60,
        notaMinima: 1.0,
        notaMaxima: 7.0,
        notaAprobacion: 4.0,
        incremento: 1.0,
        orden: 'asc'
      });
    });

    it('debe generar escala con 101 puntos (0 a 100 con incremento 1)', () => {
      const { result } = renderHook(() => useGradeScale());
      expect(result.current.scaleData.length).toBe(101);
    });

    it('debe estar válido inicialmente', () => {
      const { result } = renderHook(() => useGradeScale());
      expect(result.current.isValid).toBe(true);
      expect(Object.keys(result.current.validationErrors).length).toBe(0);
    });
  });

  describe('Fórmula de dos segmentos', () => {
    it('debe asignar nota mínima en puntaje 0', () => {
      const { result } = renderHook(() => useGradeScale());
      const firstEntry = result.current.scaleData[0];

      expect(firstEntry.puntaje).toBe(0);
      expect(firstEntry.nota).toBe(1.0);
    });

    it('debe asignar nota de aprobación en puntaje de aprobación (60 puntos)', () => {
      const { result } = renderHook(() => useGradeScale());
      const approvalEntry = result.current.scaleData.find(e => e.puntaje === 60);

      expect(approvalEntry).toBeDefined();
      expect(approvalEntry?.nota).toBe(4.0);
    });

    it('debe asignar nota máxima en puntaje máximo (100)', () => {
      const { result } = renderHook(() => useGradeScale());
      const lastEntry = result.current.scaleData[result.current.scaleData.length - 1];

      expect(lastEntry.puntaje).toBe(100);
      expect(lastEntry.nota).toBe(7.0);
    });

    it('debe aumentar gradualmente en tramo reprobatorio (0-60)', () => {
      const { result } = renderHook(() => useGradeScale());
      const failing = result.current.scaleData.slice(0, 61);

      for (let i = 1; i < failing.length; i++) {
        expect(failing[i].nota).toBeGreaterThanOrEqual(failing[i - 1].nota);
      }
    });

    it('debe aumentar gradualmente en tramo aprobatorio (60-100)', () => {
      const { result } = renderHook(() => useGradeScale());
      const passing = result.current.scaleData.slice(60, 101);

      for (let i = 1; i < passing.length; i++) {
        expect(passing[i].nota).toBeGreaterThanOrEqual(passing[i - 1].nota);
      }
    });

    it('debe mantener notas dentro del rango [1.0, 7.0]', () => {
      const { result } = renderHook(() => useGradeScale());

      result.current.scaleData.forEach(entry => {
        expect(entry.nota).toBeGreaterThanOrEqual(1.0);
        expect(entry.nota).toBeLessThanOrEqual(7.0);
      });
    });

    it('debe redondear notas a 1 decimal', () => {
      const { result } = renderHook(() => useGradeScale());

      result.current.scaleData.forEach(entry => {
        const decimal = entry.nota.toString().split('.')[1];
        if (decimal) {
          expect(decimal.length).toBeLessThanOrEqual(1);
        }
      });
    });
  });

  describe('Validación de configuración', () => {
    it('debe rechazar puntaje máximo <= 0', () => {
      const { result } = renderHook(() => useGradeScale());

      act(() => {
        result.current.updateConfig({ puntajeMaximo: 0 });
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.validationErrors.puntajeMaximo).toBeDefined();
    });

    it('debe rechazar exigencia < 0%', () => {
      const { result } = renderHook(() => useGradeScale());

      act(() => {
        result.current.updateConfig({ exigencia: -10 });
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.validationErrors.exigencia).toBeDefined();
    });

    it('debe rechazar exigencia > 100%', () => {
      const { result } = renderHook(() => useGradeScale());

      act(() => {
        result.current.updateConfig({ exigencia: 150 });
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.validationErrors.exigencia).toBeDefined();
    });

    it('debe rechazar nota mínima >= nota máxima', () => {
      const { result } = renderHook(() => useGradeScale());

      act(() => {
        result.current.updateConfig({ notaMinima: 7.0, notaMaxima: 1.0 });
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.validationErrors.notaMinima).toBeDefined();
    });

    it('debe rechazar nota de aprobación fuera de rango [notaMinima, notaMaxima]', () => {
      const { result } = renderHook(() => useGradeScale());

      act(() => {
        result.current.updateConfig({ notaAprobacion: 10 });
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.validationErrors.notaAprobacion).toBeDefined();
    });

    it('debe rechazar incremento <= 0', () => {
      const { result } = renderHook(() => useGradeScale());

      act(() => {
        result.current.updateConfig({ incremento: 0 });
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.validationErrors.incremento).toBeDefined();
    });

    it('debe rechazar incremento > puntaje máximo', () => {
      const { result } = renderHook(() => useGradeScale());

      act(() => {
        result.current.updateConfig({ incremento: 150 });
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.validationErrors.incremento).toBeDefined();
    });

    it('no debe actualizar config si hay errores de validación', () => {
      const { result } = renderHook(() => useGradeScale());
      const originalConfig = result.current.config;

      act(() => {
        result.current.updateConfig({ puntajeMaximo: -5 });
      });

      expect(result.current.config).toEqual(originalConfig);
    });
  });

  describe('Actualización de configuración', () => {
    it('debe actualizar puntaje máximo', () => {
      const { result } = renderHook(() => useGradeScale());

      act(() => {
        result.current.updateConfig({ puntajeMaximo: 200 });
      });

      expect(result.current.config.puntajeMaximo).toBe(200);
    });

    it('debe actualizar exigencia', () => {
      const { result } = renderHook(() => useGradeScale());

      act(() => {
        result.current.updateConfig({ exigencia: 75 });
      });

      expect(result.current.config.exigencia).toBe(75);
    });

    it('debe recalcular escala al cambiar configuración', () => {
      const { result } = renderHook(() => useGradeScale());
      const initialLength = result.current.scaleData.length;

      act(() => {
        result.current.updateConfig({ incremento: 5.0 });
      });

      expect(result.current.scaleData.length).toBeLessThan(initialLength);
    });

    it('debe invertir orden al pasar de asc a desc', () => {
      const { result } = renderHook(() => useGradeScale());
      const ascOrder = [...result.current.scaleData];

      act(() => {
        result.current.updateConfig({ orden: 'desc' });
      });

      const descOrder = result.current.scaleData;
      expect(descOrder[0].puntaje).toBe(ascOrder[ascOrder.length - 1].puntaje);
      expect(descOrder[descOrder.length - 1].puntaje).toBe(ascOrder[0].puntaje);
    });
  });

  describe('Reseteo a valores por defecto', () => {
    it('debe restablecer a valores por defecto', () => {
      const { result } = renderHook(() => useGradeScale());

      act(() => {
        result.current.updateConfig({ puntajeMaximo: 200, exigencia: 80 });
      });

      expect(result.current.config.puntajeMaximo).toBe(200);

      act(() => {
        result.current.resetToDefaults();
      });

      expect(result.current.config.puntajeMaximo).toBe(100);
      expect(result.current.config.exigencia).toBe(60);
    });

    it('debe limpiar errores al resetear', () => {
      const { result } = renderHook(() => useGradeScale());

      act(() => {
        result.current.updateConfig({ puntajeMaximo: -5 });
      });

      expect(result.current.isValid).toBe(false);

      act(() => {
        result.current.resetToDefaults();
      });

      expect(result.current.isValid).toBe(true);
      expect(Object.keys(result.current.validationErrors).length).toBe(0);
    });
  });

  describe('Distribución de columnas en tabla', () => {
    it('debe crear columnas para layout horizontal', () => {
      const { result } = renderHook(() => useGradeScale());
      expect(result.current.tableColumns.length).toBeGreaterThan(0);
    });

    it('debe distribuir items equitativamente entre columnas', () => {
      const { result } = renderHook(() => useGradeScale());
      const { tableColumns } = result.current;
      const totalItems = tableColumns.reduce((sum, col) => sum + col.length, 0);

      expect(totalItems).toBe(result.current.scaleData.length);
    });

    it('debe tener máximo 10 columnas', () => {
      const { result } = renderHook(() => useGradeScale());
      expect(result.current.tableColumns.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Casos extremos', () => {
    it('debe manejar exigencia de 50%', () => {
      const { result } = renderHook(() => useGradeScale());

      act(() => {
        result.current.updateConfig({ exigencia: 50 });
      });

      const entry50 = result.current.scaleData.find(e => e.puntaje === 50);
      expect(entry50?.nota).toBe(4.0);
    });

    it('debe manejar cambio de escala personalizada (1-10)', () => {
      const { result } = renderHook(() => useGradeScale());

      act(() => {
        result.current.updateConfig({
          notaMinima: 1.0,
          notaMaxima: 10.0,
          notaAprobacion: 6.0,
          puntajeMaximo: 100,
          exigencia: 60
        });
      });

      expect(result.current.isValid).toBe(true);
      const firstEntry = result.current.scaleData[0];
      const lastEntry = result.current.scaleData[result.current.scaleData.length - 1];

      expect(firstEntry.nota).toBe(1.0);
      expect(lastEntry.nota).toBe(10.0);
    });

    it('debe manejar incremento no entero (0.5)', () => {
      const { result } = renderHook(() => useGradeScale());

      act(() => {
        result.current.updateConfig({ incremento: 0.5 });
      });

      expect(result.current.scaleData.length).toBeGreaterThan(101);
    });
  });
});
