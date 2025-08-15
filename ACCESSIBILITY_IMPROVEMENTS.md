# Mejoras de Accesibilidad - Weather Dashboard

## 🎨 Cambios Implementados para Mejor Accesibilidad

### 1. Sistema de Colores WCAG AA Compliant

#### Tema Oscuro (Predeterminado)
- **Fondo principal**: `hsl(224 71% 4%)` - Azul muy oscuro para reducir fatiga visual
- **Texto principal**: `hsl(213 31% 91%)` - Gris claro con contraste óptimo
- **Colores primarios**: `hsl(210 40% 70%)` - Azul accesible con contraste 7:1
- **Borderes y elementos**: `hsl(215 27.9% 16.9%)` - Grises con contraste adecuado

#### Tema Claro (Disponible)
- **Fondo principal**: `hsl(0 0% 98%)` - Blanco suave para reducir deslumbramiento
- **Texto principal**: `hsl(240 10% 3.9%)` - Negro suave con excelente contraste
- **Mantenimiento de ratios de contraste**: Mínimo 4.5:1 para texto normal

### 2. Nuevos Colores de Estado

- **Éxito**: Verde accesible con contraste adecuado
- **Advertencia**: Amarillo/naranja visible para personas con daltonismo
- **Error**: Rojo con suficiente contraste en ambos temas
- **Información**: Azul distintivo del color primario

### 3. Mejoras en Componentes

#### Botones
- **Focus rings**: Anillos de enfoque visibles para navegación por teclado
- **Estados hover**: Transiciones suaves con cambios de contraste
- **Clases utilitarias**: `.btn-primary`, `.btn-secondary`, `.btn-ghost`

#### Formularios
- **Inputs accesibles**: Bordes claramente definidos en ambos temas
- **Placeholders**: Texto con contraste suficiente
- **Estados de focus**: Anillos de enfoque y cambios de color

### 4. Selector de Tema

#### Opciones Disponibles
- **Claro**: Tema tradicional con fondo claro
- **Oscuro**: Tema optimizado para condiciones de poca luz (predeterminado)
- **Automático**: Detecta preferencias del sistema operativo

#### Implementación
- Almacenamiento en `localStorage` para persistencia
- Detección automática de cambios en preferencias del sistema
- Aplicación inmediata sin recarga de página

### 5. Elementos Mejorados

#### Scrollbars Personalizados
- Colores adaptativos según el tema activo
- Mejor visibilidad en ambos modos

#### Glass Cards
- Fondos adaptativos que respetan el tema
- Bordes más definidos para mejor separación visual

#### Mapas y Popups
- Leaflet popups con colores del tema activo
- Mejor legibilidad en modo oscuro

## 🛠️ Implementación Técnica

### Variables CSS Personalizadas
```css
:root {
  --background: 0 0% 98%;
  --foreground: 240 10% 3.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... más variables */
}

.dark {
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  --primary: 210 40% 70%;
  /* ... variables para tema oscuro */
}
```

### Sistema de Clases Utilitarias
- Integración con Tailwind CSS
- Clases consistentes: `bg-background`, `text-foreground`, etc.
- Soporte para transparencias: `bg-primary/20`

### Gestión de Estado
- Store de Pinia para manejo centralizado de temas
- Funciones utilitarias para aplicación de temas
- Persistencia automática de preferencias

## 📱 Beneficios de Accesibilidad

### Visuales
- **Reducción de fatiga ocular**: Tema oscuro como predeterminado
- **Mejor contraste**: Ratios WCAG AA en todos los elementos
- **Daltonismo**: Colores distintivos para diferentes estados

### Navegación
- **Teclado**: Focus rings visibles en todos los elementos interactivos
- **Screen readers**: Semántica HTML mejorada con colores apropiados
- **Sistema**: Respeta preferencias de accesibilidad del OS

### Experiencia de Usuario
- **Consistencia**: Sistema de colores unificado en toda la aplicación
- **Personalización**: Múltiples opciones de tema
- **Rendimiento**: Transiciones suaves sin impacto en performance

## 🎯 Estándares Cumplidos

- **WCAG 2.1 AA**: Contraste mínimo de 4.5:1 para texto normal
- **WCAG 2.1 AA**: Contraste mínimo de 3:1 para elementos gráficos
- **Sección 508**: Compatibilidad con tecnologías asistivas
- **Responsive Design**: Mantiene accesibilidad en todos los tamaños de pantalla

## 🔄 Uso

### Cambiar Tema
1. Hacer clic en el botón "Settings" en el header
2. Seleccionar tema deseado en "Tema de la aplicación"
3. El cambio se aplica inmediatamente y se guarda automáticamente

### Modo Automático
- Detecta `prefers-color-scheme` del navegador
- Cambia automáticamente entre claro y oscuro según preferencias del sistema
- Escucha cambios en tiempo real

La implementación asegura que Weather Dashboard sea completamente accesible para usuarios con diferentes necesidades visuales y preferencias, proporcionando una experiencia consistente y cómoda independientemente de las condiciones de uso.
