import { useState, useEffect } from 'react';

/**
 * Esquemas de color disponibles para la aplicación
 * Cada tema define colores para header, botones, tabla y más
 */
export interface ThemeScheme {
  name: string;
  id: string;
  headerGradient: string;
  primaryGradient: string;
  secondaryGradient: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  tableHeaderBg: string;
  tableHeaderText: string;
  statCardBg: string;
  panelBg: string;
  panelText: string;
  inputBg: string;
  inputBorder: string;
  buttonPrimaryBg: string;
  buttonSuccessBg: string;
  buttonGlassBg: string;
  approvedNotaBg: string;
  failedNotaBg: string;
}

/**
 * Colecciones de temas disponibles
 */
const THEMES: Record<string, ThemeScheme> = {
  light: {
    name: '☀️ Claro',
    id: 'light',
    headerGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    primaryGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
    secondaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accentColor: '#667eea',
    backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
    textColor: '#333333',
    tableHeaderBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    tableHeaderText: 'white',
    statCardBg: 'rgba(255, 255, 255, 0.95)',
    panelBg: 'rgba(255, 255, 255, 0.9)',
    panelText: '#333333',
    inputBg: 'white',
    inputBorder: '#ddd',
    buttonPrimaryBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    buttonSuccessBg: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    buttonGlassBg: 'rgba(255, 255, 255, 0.25)',
    approvedNotaBg: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    failedNotaBg: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)',
  },
  dark: {
    name: '🌙 Oscuro',
    id: 'dark',
    headerGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    primaryGradient: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 50%, #16213e 100%)',
    secondaryGradient: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
    accentColor: '#00d4ff',
    backgroundColor: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 50%, #16213e 100%)',
    textColor: '#e0e0e0',
    tableHeaderBg: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
    tableHeaderText: '#00d4ff',
    statCardBg: 'rgba(22, 33, 62, 0.8)',
    panelBg: 'rgba(26, 26, 46, 0.9)',
    panelText: '#e0e0e0',
    inputBg: '#1a1a2e',
    inputBorder: '#444',
    buttonPrimaryBg: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
    buttonSuccessBg: 'linear-gradient(135deg, #00b651 0%, #00d68a 100%)',
    buttonGlassBg: 'rgba(255, 255, 255, 0.1)',
    approvedNotaBg: 'linear-gradient(135deg, #00b651 0%, #00d68a 100%)',
    failedNotaBg: 'linear-gradient(135deg, #e74c3c 0%, #ff6b35 100%)',
  },
  green: {
    name: '🌿 Verde',
    id: 'green',
    headerGradient: 'linear-gradient(135deg, #0ba360 0%, #0d7a4a 50%, #1e5631 100%)',
    primaryGradient: 'linear-gradient(135deg, #1e5631 0%, #0d7a4a 50%, #0ba360 100%)',
    secondaryGradient: 'linear-gradient(135deg, #0ba360 0%, #0d7a4a 100%)',
    accentColor: '#2ecc71',
    backgroundColor: 'linear-gradient(135deg, #1e5631 0%, #0d7a4a 50%, #0ba360 100%)',
    textColor: '#ffffff',
    tableHeaderBg: 'linear-gradient(135deg, #0ba360 0%, #0d7a4a 100%)',
    tableHeaderText: 'white',
    statCardBg: 'rgba(27, 94, 32, 0.9)',
    panelBg: 'rgba(13, 122, 74, 0.85)',
    panelText: '#ffffff',
    inputBg: 'rgba(255, 255, 255, 0.95)',
    inputBorder: '#2ecc71',
    buttonPrimaryBg: 'linear-gradient(135deg, #0ba360 0%, #0d7a4a 100%)',
    buttonSuccessBg: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
    buttonGlassBg: 'rgba(255, 255, 255, 0.2)',
    approvedNotaBg: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
    failedNotaBg: 'linear-gradient(135deg, #e74c3c 0%, #ff6b35 100%)',
  },
  ocean: {
    name: '🌊 Océano',
    id: 'ocean',
    headerGradient: 'linear-gradient(135deg, #006ba6 0%, #0084d1 50%, #00a8e8 100%)',
    primaryGradient: 'linear-gradient(135deg, #00a8e8 0%, #0084d1 50%, #006ba6 100%)',
    secondaryGradient: 'linear-gradient(135deg, #00a8e8 0%, #006ba6 100%)',
    accentColor: '#00d4ff',
    backgroundColor: 'linear-gradient(135deg, #006ba6 0%, #0084d1 50%, #00a8e8 100%)',
    textColor: '#ffffff',
    tableHeaderBg: 'linear-gradient(135deg, #00a8e8 0%, #006ba6 100%)',
    tableHeaderText: 'white',
    statCardBg: 'rgba(0, 106, 166, 0.9)',
    panelBg: 'rgba(0, 132, 209, 0.85)',
    panelText: '#ffffff',
    inputBg: 'rgba(255, 255, 255, 0.95)',
    inputBorder: '#00d4ff',
    buttonPrimaryBg: 'linear-gradient(135deg, #00a8e8 0%, #006ba6 100%)',
    buttonSuccessBg: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    buttonGlassBg: 'rgba(255, 255, 255, 0.2)',
    approvedNotaBg: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    failedNotaBg: 'linear-gradient(135deg, #e74c3c 0%, #ff6b35 100%)',
  },
  sunset: {
    name: '🌅 Atardecer',
    id: 'sunset',
    headerGradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)',
    primaryGradient: 'linear-gradient(135deg, #ff9ff3 0%, #feca57 50%, #ff6b6b 100%)',
    secondaryGradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
    accentColor: '#ff6b6b',
    backgroundColor: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)',
    textColor: '#ffffff',
    tableHeaderBg: 'linear-gradient(135deg, #ff9ff3 0%, #ff6b6b 100%)',
    tableHeaderText: 'white',
    statCardBg: 'rgba(255, 107, 107, 0.9)',
    panelBg: 'rgba(255, 159, 243, 0.85)',
    panelText: '#ffffff',
    inputBg: 'rgba(255, 255, 255, 0.95)',
    inputBorder: '#ff6b6b',
    buttonPrimaryBg: 'linear-gradient(135deg, #ff9ff3 0%, #ff6b6b 100%)',
    buttonSuccessBg: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    buttonGlassBg: 'rgba(255, 255, 255, 0.2)',
    approvedNotaBg: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    failedNotaBg: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
  },
  midnight: {
    name: '⭐ Medianoche',
    id: 'midnight',
    headerGradient: 'linear-gradient(135deg, #1a0033 0%, #330066 50%, #4d0099 100%)',
    primaryGradient: 'linear-gradient(135deg, #4d0099 0%, #330066 50%, #1a0033 100%)',
    secondaryGradient: 'linear-gradient(135deg, #4d0099 0%, #1a0033 100%)',
    accentColor: '#b366ff',
    backgroundColor: 'linear-gradient(135deg, #1a0033 0%, #330066 50%, #4d0099 100%)',
    textColor: '#e0e0ff',
    tableHeaderBg: 'linear-gradient(135deg, #4d0099 0%, #330066 100%)',
    tableHeaderText: '#b366ff',
    statCardBg: 'rgba(51, 0, 102, 0.9)',
    panelBg: 'rgba(26, 0, 51, 0.95)',
    panelText: '#e0e0ff',
    inputBg: '#220044',
    inputBorder: '#6600cc',
    buttonPrimaryBg: 'linear-gradient(135deg, #4d0099 0%, #330066 100%)',
    buttonSuccessBg: 'linear-gradient(135deg, #00cc66 0%, #00ff99 100%)',
    buttonGlassBg: 'rgba(179, 102, 255, 0.2)',
    approvedNotaBg: 'linear-gradient(135deg, #00cc66 0%, #00ff99 100%)',
    failedNotaBg: 'linear-gradient(135deg, #ff3366 0%, #ff6699 100%)',
  },
  forest: {
    name: '🌲 Bosque',
    id: 'forest',
    headerGradient: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)',
    primaryGradient: 'linear-gradient(135deg, #40916c 0%, #2d6a4f 50%, #1b4332 100%)',
    secondaryGradient: 'linear-gradient(135deg, #40916c 0%, #1b4332 100%)',
    accentColor: '#52b788',
    backgroundColor: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)',
    textColor: '#ffffff',
    tableHeaderBg: 'linear-gradient(135deg, #40916c 0%, #2d6a4f 100%)',
    tableHeaderText: 'white',
    statCardBg: 'rgba(27, 67, 50, 0.9)',
    panelBg: 'rgba(45, 106, 79, 0.85)',
    panelText: '#ffffff',
    inputBg: 'rgba(255, 255, 255, 0.95)',
    inputBorder: '#52b788',
    buttonPrimaryBg: 'linear-gradient(135deg, #40916c 0%, #2d6a4f 100%)',
    buttonSuccessBg: 'linear-gradient(135deg, #52b788 0%, #74c69d 100%)',
    buttonGlassBg: 'rgba(255, 255, 255, 0.15)',
    approvedNotaBg: 'linear-gradient(135deg, #52b788 0%, #74c69d 100%)',
    failedNotaBg: 'linear-gradient(135deg, #e76f51 0%, #ff9d7b 100%)',
  },
};

/**
 * Custom hook para gestionar temas de la aplicación
 * Persiste la preferencia en localStorage
 */
export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeScheme>(THEMES.light);
  const [mounted, setMounted] = useState(false);

  // Cargar tema del localStorage al montar
  useEffect(() => {
    const savedThemeId = localStorage.getItem('app-theme');
    if (savedThemeId && THEMES[savedThemeId]) {
      setCurrentTheme(THEMES[savedThemeId]);
    }
    setMounted(true);
  }, []);

  // Cambiar tema y guardar en localStorage
  const changeTheme = (themeId: string) => {
    if (THEMES[themeId]) {
      setCurrentTheme(THEMES[themeId]);
      localStorage.setItem('app-theme', themeId);
    }
  };

  // Obtener lista de temas disponibles
  const availableThemes = Object.values(THEMES);

  return {
    currentTheme,
    changeTheme,
    availableThemes,
    mounted,
  };
};
