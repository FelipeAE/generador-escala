export interface GradeScaleConfig {
  puntajeMaximo: number;
  exigencia: number;
  notaMinima: number;
  notaMaxima: number;
  notaAprobacion: number;
  incremento: number;
  orden: 'asc' | 'desc';
}

export interface ScaleDataPoint {
  puntaje: number;
  nota: number;
}

export interface ValidationResult {
  puntaje: number;
  expectedNota: number;
  actualNota: number | null;
  isValid: boolean;
  difference: number | null;
}