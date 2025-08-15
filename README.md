# 🌤️ Weather Dashboard

Un dashboard meteorológico moderno, interactivo y completo construido con Vue 3, TypeScript y Tailwind CSS. Proporciona información meteorológica en tiempo real, pronósticos detallados, mapas interactivos y alertas personalizadas.

![Weather Dashboard](https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=400&fit=crop)

## ✨ Características Principales

### 🎯 Funcionalidades Core

- **🌡️ Información Meteorológica en Tiempo Real** - Datos actuales de temperatura, humedad, viento y más
- **📊 Pronósticos Detallados** - Pronósticos horarios y de 3 días con detalles completos
- **🗺️ Mapas Meteorológicos Interactivos** - Visualización de temperatura, precipitación, nubes y viento
- **📈 Análisis y Gráficos** - Visualizaciones avanzadas con Chart.js
- **🔔 Alertas Personalizadas** - Sistema de notificaciones meteorológicas configurables
- **📍 Gestión de Ubicaciones** - Guardar y gestionar múltiples ubicaciones favoritas

### 🎨 Diseño y UX

- **🌟 Interfaz Moderna** - Diseño glass-morphism con gradientes y efectos visuales
- **📱 Totalmente Responsive** - Optimizado para desktop, tablet y móvil
- **⚡ Animaciones Fluidas** - Transiciones y micro-interacciones elegantes
- **🎭 Temas Dinámicos** - Colores que se adaptan a las condiciones meteorológicas
- **♿ Accesibilidad** - Cumple con estándares WCAG para inclusividad

### 🛠️ Tecnologías Avanzadas

- **Vue 3** con Composition API
- **TypeScript** para type safety
- **Tailwind CSS** para estilos
- **Chart.js** para visualizaciones
- **Leaflet** para mapas interactivos
- **Vite** para development y build
- **Vitest** para testing

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ o superior
- npm o pnpm
- API Key de [WeatherAPI](https://www.weatherapi.com/) (opcional para demo)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/weather-dashboard.git

# Navegar al directorio
cd weather-dashboard

# Instalar dependencias con pnpm (recomendado)
pnpm install

# O con npm
npm install

# Ejecutar en modo desarrollo
pnpm dev

# O con npm
npm run dev
```

### Configuración de API

#### Para Desarrollo Local

1. **Obtener API Key**: Registrarse en [WeatherAPI](https://www.weatherapi.com/) para obtener una API key gratuita
2. **Configurar Variables de Entorno**: 
   ```bash
   # Copiar el archivo de ejemplo
   cp .env.example .env
   
   # Editar .env y agregar tu API key
   VITE_WEATHER_API_KEY=tu_api_key_aqui
   ```
3. **Ejecutar la aplicación**: `pnpm dev`

#### Para Tests

Los tests usan una API key de prueba automáticamente. No se requiere configuración adicional.

> 💡 **Nota**: 
> - La aplicación funciona en modo demo sin API key, mostrando datos meteorológicos simulados
> - **Leaflet no requiere API key** - usa mapas gratuitos de OpenStreetMap por defecto
> - Solo necesitas API key para datos meteorológicos reales de WeatherAPI

## 📋 Scripts Disponibles

```bash
# Desarrollo
pnpm dev                 # Ejecutar servidor de desarrollo
pnpm build              # Construir para producción
pnpm preview            # Vista previa de build de producción

# Calidad de Código
pnpm lint               # Ejecutar ESLint
pnpm format             # Formatear código con Prettier
pnpm type-check         # Verificar tipos con TypeScript

# Testing
pnpm test               # Ejecutar tests
pnpm test:coverage      # Tests con reporte de cobertura
pnpm test:ui            # Interfaz visual para tests
```

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes Vue reutilizables
│   ├── ui/             # Componentes base de UI
│   ├── WeatherCard.vue # Tarjeta principal del clima
│   ├── WeatherMap.vue  # Mapa interactivo
│   ├── WeatherCharts.vue # Gráficos y análisis
│   ├── DailyForecast.vue # Pronóstico de 3 días
│   ├── WeatherAlerts.vue # Sistema de alertas
│   └── LocationManager.vue # Gestión de ubicaciones
├── composables/        # Lógica reutilizable de Vue
│   └── useWeather.ts   # Hook principal para datos meteorológicos
├── services/           # Servicios y APIs
│   └── weatherService.ts # Integración con WeatherAPI
├── types/              # Definiciones de TypeScript
│   └── weather.ts      # Tipos para datos meteorológicos
├── lib/                # Utilidades y helpers
└── styles/             # Estilos globales y configuración
```

## 🎨 Componentes Principales

### WeatherCard

Muestra información meteorológica actual con:

- Temperatura actual y sensación térmica
- Condiciones climáticas con iconos animados
- Métricas detalladas (humedad, viento, presión, UV)
- Indicadores visuales dinámicos

### WeatherCharts

Análisis visual avanzado con:

- Gráficos de temperatura y tendencias
- Análisis de precipitación y humedad
- Comparativas y métricas múltiples
- Visualizaciones interactivas

### WeatherMap

Mapa interactivo que incluye:

- Capas de temperatura, precipitación, nubes y viento
- Marcadores de ubicaciones con datos en tiempo real
- Controles de zoom y navegación
- Leyendas explicativas

### DailyForecast

Pronóstico extendido con:

- Vista de 3 días con detalles expandibles
- Pronósticos horarios
- Datos astronómicos (amanecer, atardecer, fases lunares)
- Métricas detalladas por día

### WeatherAlerts

Sistema de notificaciones que permite:

- Crear alertas personalizadas por temperatura, lluvia, viento, UV
- Configurar umbrales y condiciones
- Activar/desactivar alertas individualmente
- Gestión completa de notificaciones

### LocationManager

Gestión avanzada de ubicaciones:

- Búsqueda inteligente de ciudades
- Guardar ubicaciones favoritas
- Vista previa del clima por ubicación
- Configuración de ubicación por defecto

## 🔧 Configuración Avanzada

### Variables de Entorno

```bash
# .env.local
VITE_WEATHER_API_KEY=tu_api_key_aqui
VITE_MAP_API_KEY=tu_map_api_key_aqui
```

### Personalización de Temas

Los temas se adaptan automáticamente a las condiciones meteorológicas:

```css
.weather-sunny {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
.weather-cloudy {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.weather-rainy {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
.weather-snowy {
    background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
}
```

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

### Netlify

```bash
# Build local
pnpm build

# Arrastrar carpeta 'dist' a Netlify
# O conectar repositorio GitHub
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🧪 Testing

El proyecto incluye tests completos con Vitest:

```bash
# Ejecutar todos los tests
pnpm test

# Tests en modo watch
pnpm test --watch

# Cobertura de código
pnpm test:coverage

# UI interactiva de tests
pnpm test:ui
```

### Estructura de Tests

- **Unit Tests**: Componentes individuales y funciones
- **Integration Tests**: Interacciones entre componentes
- **E2E Tests**: Flujos completos de usuario (con Playwright)

## 🔄 CI/CD

Configuración automática con GitHub Actions:

- ✅ **Linting** con ESLint
- ✅ **Formateo** con Prettier
- ✅ **Type Checking** con TypeScript
- ✅ **Testing** con cobertura
- ✅ **Build** y verificación
- 🚀 **Deploy** automático a Vercel/Netlify

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

### Estándares de Código

- Usar **Conventional Commits**: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- Mantener **cobertura de tests** > 85%
- Seguir las reglas de **ESLint** y **Prettier**
- Documentar nuevas funcionalidades

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Reconocimientos

- **[WeatherAPI](https://www.weatherapi.com/)** - Datos meteorológicos
- **[Unsplash](https://unsplash.com/)** - Imágenes de alta calidad
- **[Lucide](https://lucide.dev/)** - Iconos SVG beautiful
- **[Chart.js](https://www.chartjs.org/)** - Visualizaciones de datos
- **[Leaflet](https://leafletjs.com/)** - Mapas interactivos

## 📞 Soporte

¿Tienes preguntas o necesitas ayuda?

- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/weather-dashboard/issues)
- 💬 **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/weather-dashboard/discussions)
- 📧 **Email**: tu-email@ejemplo.com

---

<div align="center">
  <p>Hecho con ❤️ y ☕ por el equipo de desarrollo</p>
  <p>
    <a href="#-weather-dashboard">Volver arriba</a>
  </p>
</div>
