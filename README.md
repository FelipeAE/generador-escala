# Generador de Escala de Notas Chilenas

Una aplicación web moderna para generar escalas de calificación académica según el sistema educativo chileno. Desarrollada con React, TypeScript y Vite.

🔗 **Ver aplicación en vivo**: [https://felipeae.github.io/generador-escala/](https://felipeae.github.io/generador-escala/)

## Características

✨ **Interfaz moderna**: Diseño colorido con gradientes y efectos glassmorphism  
📊 **Tabla horizontal**: Layout optimizado que aprovecha todo el ancho de pantalla  
⚙️ **Configuración flexible**: Personaliza todos los parámetros de la escala  
📁 **Exportación**: Descarga en formato CSV o imprime directamente  
📱 **Responsive**: Funciona perfectamente en dispositivos móviles  
🧮 **Fórmula oficial**: Implementa correctamente la escala chilena de dos segmentos  

## Fórmula Implementada

La aplicación utiliza la fórmula oficial chilena de escala de notas con dos segmentos:

- **Tramo reprobatorio** (puntaje < puntaje de aprobación):
  ```
  nota = nmin + (napr - nmin) * (puntaje / (pmax * e))
  ```

- **Tramo aprobatorio** (puntaje ≥ puntaje de aprobación):
  ```
  nota = napr + (nmax - napr) * ((puntaje - pmax*e) / (pmax*(1-e)))
  ```

**Donde:**
- `nmax` = Nota máxima (7.0)
- `nmin` = Nota mínima (1.0) 
- `napr` = Nota de aprobación (4.0)
- `e` = Exigencia como decimal (60% = 0.6)
- `pmax` = Puntaje máximo (100)

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Linter
npm run lint

# Desplegar a GitHub Pages
npm run deploy
```

## Tecnologías

- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Build tool y servidor de desarrollo
- **Lucide React** - Iconos modernos
- **GitHub Actions** - CI/CD automático
- **GitHub Pages** - Hosting

## Arquitectura

- `src/hooks/useGradeScale.ts` - Lógica principal y cálculos de la escala
- `src/types/index.ts` - Interfaces y tipos TypeScript
- `src/App.tsx` - Componente principal con UI y interacciones
- `src/index.css` - Estilos modernos con gradientes y animaciones

## Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request
