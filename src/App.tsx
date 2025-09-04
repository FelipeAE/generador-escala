import React, { useState } from 'react';
import { Calculator, Settings, Download, FileSpreadsheet, RotateCcw, Zap, Target, TrendingUp } from 'lucide-react';
import { useGradeScale } from './hooks/useGradeScale';
import type { GradeScaleConfig } from './types';

function App() {
  const { config, updateConfig, scaleData } = useGradeScale();
  const [showConfig, setShowConfig] = useState(false);

  const handleInputChange = (field: keyof GradeScaleConfig, value: string) => {
    updateConfig({ [field]: parseFloat(value) || 0 });
  };

  const handleOrderChange = (order: 'asc' | 'desc') => {
    updateConfig({ orden: order });
  };

  const resetToDefaults = () => {
    updateConfig({
      puntajeMaximo: 100,
      exigencia: 60,
      notaMinima: 1.0,
      notaMaxima: 7.0,
      notaAprobacion: 4.0,
      incremento: 1.0,
      orden: 'asc'
    });
  };

  const exportToCSV = () => {
    const csvContent = scaleData.map(item => 
      `${item.puntaje},${item.nota}`
    ).join('\n');
    
    const header = 'Puntaje,Nota\n';
    const blob = new Blob([header + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'escala_notas.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printTable = () => {
    window.print();
  };

  // Calcular columnas para layout horizontal
  const columnCount = Math.min(12, Math.ceil(scaleData.length / 15));
  const itemsPerColumn = Math.ceil(scaleData.length / columnCount);
  const tableColumns: Array<Array<{puntaje: number, nota: number}>> = [];
  
  for (let i = 0; i < columnCount; i++) {
    const startIndex = i * itemsPerColumn;
    const endIndex = Math.min(startIndex + itemsPerColumn, scaleData.length);
    tableColumns.push(scaleData.slice(startIndex, endIndex));
  }

  return (
    <div className="app">
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
              onClick={() => setShowConfig(!showConfig)}
              className="btn btn-glass"
            >
              <Settings />
              Configuración
            </button>
            <button
              onClick={exportToCSV}
              className="btn btn-success"
            >
              <Download />
              CSV
            </button>
            <button
              onClick={printTable}
              className="btn btn-primary"
            >
              <FileSpreadsheet />
              Imprimir
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stats-container">
          <div className="stat-card blue">
            <Target />
            <div className="stat-info">
              <h3>Puntaje de Aprobación</h3>
              <p>{Math.round(config.puntajeMaximo * config.exigencia / 100)} pts</p>
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
                onClick={resetToDefaults}
                className="btn btn-reset"
              >
                <RotateCcw />
                Restablecer
              </button>
            </div>
            
            <div className="form-grid">
              <div className="form-group blue">
                <label>🎯 Puntaje máximo</label>
                <input
                  type="number"
                  value={config.puntajeMaximo}
                  onChange={(e) => handleInputChange('puntajeMaximo', e.target.value)}
                  className="form-control"
                  min="1"
                />
              </div>
              
              <div className="form-group green">
                <label>📊 Exigencia (%)</label>
                <input
                  type="number"
                  value={config.exigencia}
                  onChange={(e) => handleInputChange('exigencia', e.target.value)}
                  className="form-control"
                  min="1" 
                  max="100"
                />
              </div>
              
              <div className="form-group red">
                <label>📉 Nota mínima</label>
                <input
                  type="number"
                  value={config.notaMinima}
                  onChange={(e) => handleInputChange('notaMinima', e.target.value)}
                  className="form-control"
                  step="0.1"
                />
              </div>
              
              <div className="form-group green">
                <label>📈 Nota máxima</label>
                <input
                  type="number"
                  value={config.notaMaxima}
                  onChange={(e) => handleInputChange('notaMaxima', e.target.value)}
                  className="form-control"
                  step="0.1"
                />
              </div>
              
              <div className="form-group orange">
                <label>✅ Nota aprobación</label>
                <input
                  type="number"
                  value={config.notaAprobacion}
                  onChange={(e) => handleInputChange('notaAprobacion', e.target.value)}
                  className="form-control"
                  step="0.1"
                />
              </div>
              
              <div className="form-group purple">
                <label>⚡ Incremento</label>
                <select
                  value={config.incremento}
                  onChange={(e) => handleInputChange('incremento', e.target.value)}
                  className="form-control"
                >
                  <option value={0.5}>0.5</option>
                  <option value={1.0}>1.0</option>
                  <option value={2.0}>2.0</option>
                  <option value={5.0}>5.0</option>
                </select>
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
                  <span>📈 Ascendente</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="orden"
                    value="desc"
                    checked={config.orden === 'desc'}
                    onChange={(e) => handleOrderChange(e.target.value as 'asc' | 'desc')}
                  />
                  <span>📉 Descendente</span>
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
                <h2>🎯 Tabla de Conversión</h2>
                <p>
                  Puntaje de aprobación: {Math.round(config.puntajeMaximo * config.exigencia / 100)} pts
                  ({config.exigencia}% de {config.puntajeMaximo})
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
                      <th>📊 PUNTAJE</th>
                      <th>🎓 NOTA</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: itemsPerColumn }).map((_, rowIndex) => (
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