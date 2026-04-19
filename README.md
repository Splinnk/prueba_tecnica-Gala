# 🚀 BlogManager Professional - Prueba Técnica Fullstack

Este proyecto es un sistema de gestión de noticias (Blog) de alto rendimiento, construido con un enfoque en **Arquitectura Limpia**, **UX/UI Premium** e **Internacionalización profunda (i18n)**.

### 🔗 Enlace del Proyecto (Demo en Vivo)
**[https://prueba-tecnica-gala.vercel.app/es](https://prueba-tecnica-gala.vercel.app)**

---

## 🌟 Características Principales

- **CRUD Completo:** Creación, lectura, edición y eliminación de noticias.
- **Internacionalización (i18n):** Soporte completo para Español e Inglés mediante rutas dinámicas (`/es`, `/en`) y persistencia de idioma.
- **Arquitectura de Concurrencia:** Implementación de **Control de Concurrencia Optimista (OCC)** mediante versionamiento para prevenir colisiones de edición entre múltiples usuarios.
- **UI/UX Moderna:** Interfaz diseñada con **Tailwind CSS v4**, enfocada en micro-interacciones, diseño responsivo y estados de carga (Skeleton/Spinners).
- **Validación Robusta:** Uso de **Zod** en el backend para integridad de datos y **Axios** para comunicación asíncrona.

---

## 🏗️ Decisiones Arquitectónicas

### 1. Control de Concurrencia Optimista (OCC)
En lugar de implementar bloqueos de base de datos ("Hard Locks") que pueden quedar huérfanos por fallos de red o cierres inesperados de pestaña, se implementó un sistema de **Versiones**. 
Cada noticia posee un campo `version`. Si dos usuarios intentan guardar cambios sobre la misma versión, el backend rechaza la petición que llegue en segundo lugar, notificando al usuario que debe refrescar la información para evitar la pérdida o sobreescritura de datos.

### 2. Middleware de Internacionalización
Se utilizó `next-intl` con un middleware configurado para interceptar las peticiones y manejar el enrutamiento basado en el locale, garantizando una experiencia fluida y amigable para SEO en ambos idiomas.

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Estilos:** Tailwind CSS v4
- **Internacionalización:** next-intl
- **Notificaciones:** Sonner
- **Iconos:** Lucide React

### Backend
- **Runtime:** Node.js + Express
- **ORM:** Prisma
- **Base de Datos:** PostgreSQL (Alojada en Render)
- **Validación:** Zod

---

## ⚙️ Configuración y Ejecución Local

### Requisitos previos
- Node.js (v18+)
- pnpm o npm
- Una instancia de PostgreSQL

### Instalación y ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/Splinnk/prueba_tecnica-Gala](https://github.com/Splinnk/prueba_tecnica-Gala)

2. **Configuración del Backend:**
   - Entrar a la carpeta `backend`: `cd backend`
   - Instalar dependencias: `pnpm install`
   - Crear y configurar el archivo `.env` en la carpeta `backend` (ver sección de variables de entorno).
   - Sincronizar la base de datos: `pnpm exec prisma db push`
   - Iniciar en modo desarrollo: `pnpm run dev`

3. **Configuración del Frontend:**
   - Entrar a la carpeta `frontend`: `cd ../frontend`
   - Instalar dependencias: `pnpm install`
   - Crear y configurar el archivo `.env.local` en la carpeta `frontend`.
   - Iniciar en modo desarrollo: `pnpm run dev`

---

## 🌍 Despliegue (Deployment)

### Variables de Entorno Necesarias

**Backend (`/backend/.env`):**
- `DATABASE_URL`: URL de conexión a tu instancia de PostgreSQL.
- `PORT`: 3001 (o el puerto de tu preferencia).

**Frontend (`/frontend/.env.local`):**
- `NEXT_PUBLIC_API_URL`: URL pública de tu API (ej. `https://prueba.onrender.com/api`).

### Despliegue en Render (Backend)
1. **Root Directory:** `backend`
2. **Build Command:** `pnpm install && pnpm exec prisma generate && pnpm exec prisma db push && pnpm run build`
3. **Start Command:** `pnpm start`

### Despliegue en Vercel (Frontend)
1. **Root Directory:** `frontend`
2. **Framework Preset:** Next.js
3. **Environment Variables:** Configurar `NEXT_PUBLIC_API_URL` apuntando al backend de Render (incluyendo el sufijo `/api`).

---
*Desarrollado con enfoque en calidad técnica, usabilidad y escalabilidad.*
