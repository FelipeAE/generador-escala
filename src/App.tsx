import React, { useState, useMemo } from 'react';
import { Calculator, Settings, Download, FileSpreadsheet, RotateCcw, Zap, Target, TrendingUp, AlertCircle, Palette } from 'lucide-react';
import { useGradeScale } from './hooks/useGradeScale';
import { useTheme } from './hooks/useTheme';
import type { GradeScaleConfig } from './types';

function App() {
  const { config, updateConfig, resetToDefaults, scaleData, tableColumns, validationErrors, isValid } = useGradeScale();
  const { currentTheme, changeTheme, availableThemes, mounted } = useTheme();
  const [showConfig, setShowConfig] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const handleInputChange = (field: keyof GradeScaleConfig, value: string) => {
    updateConfig({ [field]: parseFloat(value) || 0 });
  };

  const handleOrderChange = (order: 'asc' | 'desc') => {
    updateConfig({ orden: order });
  };

  /**
   * Exporta la tabla de escala a formato CSV
   * Incluye header con nombres de columnas y timestamp
   */
  const exportToCSV = () => {
    try {
      const csvContent = scaleData.map(item =>
        `${item.puntaje},${item.nota}`
      ).join('\n');

      const header = 'Puntaje,Nota\n';
      const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `escala_notas_${timestamp}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error al exportar CSV. Por favor intenta nuevamente.');
    }
  };

  /**
   * Abre la vista de impresión del navegador
   */
  const printTable = () => {
    window.print();
  };

  // Calcular puntaje de aprobación
  const puntajeAprobacion = Math.round(config.puntajeMaximo * config.exigencia / 100);

  // Estilos dinámicos basados en el tema actual
  const themeStyles = useMemo(() => ({
    '--header-gradient': currentTheme.headerGradient,
    '--primary-gradient': currentTheme.primaryGradient,
    '--secondary-gradient': currentTheme.secondaryGradient,
    '--accent-color': currentTheme.accentColor,
    '--background': currentTheme.backgroundColor,
    '--text-color': currentTheme.textColor,
    '--table-header-bg': currentTheme.tableHeaderBg,
    '--table-header-text': currentTheme.tableHeaderText,
    '--stat-card-bg': currentTheme.statCardBg,
    '--panel-bg': currentTheme.panelBg,
    '--panel-text': currentTheme.panelText,
    '--input-bg': currentTheme.inputBg,
    '--input-border': currentTheme.inputBorder,
    '--button-primary-bg': currentTheme.buttonPrimaryBg,
    '--button-success-bg': currentTheme.buttonSuccessBg,
    '--button-glass-bg': currentTheme.buttonGlassBg,
    '--approved-nota-bg': currentTheme.approvedNotaBg,
    '--failed-nota-bg': currentTheme.failedNotaBg,
  } as React.CSSProperties), [currentTheme]);

  if (!mounted) return null;

  return (
    <div className="app" style={themeStyles}>
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <Calculator />
            </div>
            <div className="header-title">
              <h1>Generador de Escala de Notas</h1>
              <p>Sistema chileno de calificación académica</p>
            </div>
          </div>

          <div className="header-buttons">
            <button
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className="btn btn-glass"
              aria-label="Selector de temas"
              title="Cambiar tema"
            >
              <Palette />
              Tema
            </button>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="btn btn-glass"
              aria-label="Abrir/cerrar configuración"
            >
              <Settings />
              Configuración
            </button>
            <button
              onClick={exportToCSV}
              className="btn btn-success"
              aria-label="Exportar a CSV"
            >
              <Download />
              CSV
            </button>
            <button
              onClick={printTable}
              className="btn btn-primary"
              aria-label="Imprimir tabla"
            >
              <FileSpreadsheet />
              Imprimir
            </button>
          </div>
        </div>
      </div>

      {/* Theme Selector */}
      {showThemeSelector && (
        <div className="theme-selector-container">
          <div className="theme-selector">
            <h3>Selecciona un Tema</h3>
            <div className="theme-grid">
              {availableThemes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => {
                    changeTheme(theme.id);
                    setShowThemeSelector(false);
                  }}
                  className={`theme-option ${currentTheme.id === theme.id ? 'active' : ''}`}
                  style={{
                    background: theme.headerGradient,
                  }}
                  title={theme.name}
                >
                  <span>{theme.name}</span>
                  {currentTheme.id === theme.id && <span className="checkmark">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stats-container">
          <div className="stat-card blue">
            <Target />
            <div className="stat-info">
              <h3>Puntaje de Aprobación</h3>
              <p>{puntajeAprobacion} pts</p>
            </div>
          </div>
          <div className="stat-card green">
            <TrendingUp />
            <div className="stat-info">
              <h3>Exigencia</h3>
              <p>{config.exigencia}%</p>
            </div>
          </div>
          <div className="stat-card purple">
            <Zap />
            <div className="stat-info">
              <h3>Total de Entradas</h3>
              <p>{scaleData.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Configuration Panel */}
        {showConfig && (
          <div className="config-panel">
            <div className="config-header">
              <div className="config-title">
                <div className="config-icon">
                  <Settings />
                </div>
                <h2>Parámetros de Configuración</h2>
              </div>
              <button
                onClick={() => {
                  resetToDefaults();
                  setShowConfig(false);
                }}
                className="btn btn-reset"
                aria-label="Restablecer a valores por defecto"
              >
                <RotateCcw />
                Restablecer
              </button>
            </div>

            {/* Mostrar errores de validación si hay */}
            {!isValid && Object.keys(validationErrors).length > 0 && (
              <div className="validation-errors">
                <div className="error-header">
                  <AlertCircle />
                  <h3>Errores de Validación</h3>
                </div>
                <ul className="error-list">
                  {Object.entries(validationErrors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group blue">
                <label htmlFor="puntajeMaximo">Puntaje máximo</label>
                <input
                  id="puntajeMaximo"
                  type="number"
                  value={config.puntajeMaximo}
                  onChange={(e) => handleInputChange('puntajeMaximo', e.target.value)}
                  className="form-control"
                  min="1"
                  aria-describedby="puntajeMaximo-help"
                />
                <small id="puntajeMaximo-help">Puntaje máximo posible (ej: 100)</small>
              </div>

              <div className="form-group green">
                <label htmlFor="exigencia">Exigencia (%)</label>
                <input
                  id="exigencia"
                  type="number"
                  value={config.exigencia}
                  onChange={(e) => handleInputChange('exigencia', e.target.value)}
                  className="form-control"
                  min="0"
                  max="100"
                  aria-describedby="exigencia-help"
                />
                <small id="exigencia-help">Porcentaje para obtener nota mínima de aprobación</small>
              </div>

              <div className="form-group red">
                <label htmlFor="notaMinima">Nota mínima</label>
                <input
                  id="notaMinima"
                  type="number"
                  value={config.notaMinima}
                  onChange={(e) => handleInputChange('notaMinima', e.target.value)}
                  className="form-control"
                  step="0.1"
                  aria-describedby="notaMinima-help"
                />
                <small id="notaMinima-help">Nota mínima en la escala (ej: 1.0)</small>
              </div>

              <div className="form-group green">
                <label htmlFor="notaMaxima">Nota máxima</label>
                <input
                  id="notaMaxima"
                  type="number"
                  value={config.notaMaxima}
                  onChange={(e) => handleInputChange('notaMaxima', e.target.value)}
                  className="form-control"
                  step="0.1"
                  aria-describedby="notaMaxima-help"
                />
                <small id="notaMaxima-help">Nota máxima en la escala (ej: 7.0)</small>
              </div>

              <div className="form-group orange">
                <label htmlFor="notaAprobacion">Nota aprobación</label>
                <input
                  id="notaAprobacion"
                  type="number"
                  value={config.notaAprobacion}
                  onChange={(e) => handleInputChange('notaAprobacion', e.target.value)}
                  className="form-control"
                  step="0.1"
                  aria-describedby="notaAprobacion-help"
                />
                <small id="notaAprobacion-help">Nota mínima para aprobar</small>
              </div>

              <div className="form-group purple">
                <label htmlFor="incremento">Incremento</label>
                <select
                  id="incremento"
                  value={config.incremento}
                  onChange={(e) => handleInputChange('incremento', e.target.value)}
                  className="form-control"
                  aria-describedby="incremento-help"
                >
                  <option value={0.5}>0.5</option>
                  <option value={1.0}>1.0</option>
                  <option value={2.0}>2.0</option>
                  <option value={5.0}>5.0</option>
                </select>
                <small id="incremento-help">Salto entre puntajes en la tabla</small>
              </div>
            </div>

            <div className="order-section">
              <div className="order-title">
                <TrendingUp />
                <h3>Orden de Visualización</h3>
              </div>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="orden"
                    value="asc"
                    checked={config.orden === 'asc'}
                    onChange={(e) => handleOrderChange(e.target.value as 'asc' | 'desc')}
                  />
                  <span>Ascendente</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="orden"
                    value="desc"
                    checked={config.orden === 'desc'}
                    onChange={(e) => handleOrderChange(e.target.value as 'asc' | 'desc')}
                  />
                  <span>Descendente</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Main Table */}
        <div className="table-container">
          <div className="table-header">
            <div className="table-header-content">
              <div className="table-icon">
                <Calculator />
              </div>
              <div className="table-title">
                <h2>Tabla de Conversión</h2>
                <p>
                  Puntaje de aprobación: {puntajeAprobacion} pts ({config.exigencia}% de {config.puntajeMaximo})
                </p>
              </div>
            </div>
          </div>

          <div className="table-content">
            <table className="scale-table">
              <thead>
                <tr>
                  {tableColumns.map((_, index) => (
                    <React.Fragment key={index}>
                      <th>PUNTAJE</th>
                      <th>NOTA</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.ceil(scaleData.length / tableColumns.length) }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {tableColumns.map((column, colIndex) => {
                      const item = column[rowIndex];
                      const isApproved = item && item.nota >= config.notaAprobacion;
                      return (
                        <React.Fragment key={colIndex}>
                          <td className="puntaje-cell">
                            {item?.puntaje ?? ''}
                          </td>
                          <td className={isApproved ? 'nota-approved' : 'nota-failed'}>
                            {item?.nota ?? ''}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
