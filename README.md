# Tapa Contest

Una aplicación web interactiva para organizar concursos de tapas entre familias. Construida con React, TypeScript, Vite y Firebase.

## Características

- **Panel de Control Admin**: Gestiona las fases del concurso (Registro → Votación → Resultados)
- **Sistema de Votación**: Permite a los participantes votar y rankear platos
- **Cálculo Automático**: Calcula ganadores basado en un sistema de puntuación
- **Integración Firebase**: Sincronización en tiempo real de datos
- **Responsive Design**: Interfaz adaptable a diferentes dispositivos (Tailwind CSS)

## Tecnologías

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + PostCSS
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Router**: React Router DOM 7
- **Linting**: ESLint 9 + TypeScript ESLint
- **Icons**: Lucide React

## Instalación

```bash
# Instalar dependencias
npm install --legacy-peer-deps

# Configurar variables de entorno (Firebase)
# Crear archivo .env con tus credenciales de Firebase
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Ejecutar linter
npm run lint

# Verificar tipos TypeScript
npm run typecheck

# Build para producción
npm run build

# Preview de la build
npm run preview
```

## Estructura del Proyecto

```
src/
├── App.tsx              # Rutas principales
├── AdminPanel.tsx       # Panel de control del administrador
├── VotacionPantalla.tsx # Pantalla de votación
├── RegistroPlatos.tsx   # Registro de platos
├── ResultadosPantalla.tsx # Pantalla de resultados
├── firebase.ts          # Configuración de Firebase
├── main.tsx             # Punto de entrada
├── index.css            # Estilos globales
└── App.css              # Estilos específicos
```

## Rutas

- `/` - Vista principal para familias
- `/admin` - Panel de control del administrador

## Configuración TypeScript

Este proyecto utiliza TypeScript con configuración estricta. Todos los archivos `.tsx` y `.ts` incluyen tipos completos para mayor seguridad.

## Reciente

✨ **Migración a TypeScript completada** (Junio 2026)
- Convertido todo el proyecto de JavaScript a TypeScript
- ESLint 9 configurado con soporte para TypeScript
- Todas las pruebas pasando correctamente

## Licencia

MIT

