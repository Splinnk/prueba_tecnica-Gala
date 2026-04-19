# 🚀 BlogManager Professional - Prueba Técnica Fullstack

Este proyecto es un sistema de gestión de noticias (Blog) de alto rendimiento, construido con un enfoque en **Arquitectura Limpia**, **UX/UI Premium** e **Internacionalización profunda (i18n)**.

## 🌟 Características Principales

- **CRUD Completo:** Creación, lectura, edición y eliminación de noticias.
- **Internacionalización (i18n):** Soporte completo para Español e Inglés mediante rutas dinámicas (`/es`, `/en`) y persistencia de idioma.
- **Arquitectura de Concurrencia:** Implementación de **Control de Concurrencia Optimista (OCC)** mediante versionamiento de base de datos para prevenir colisiones de edición entre múltiples usuarios.
- **UI/UX Moderna:** Interfaz diseñada con **Tailwind CSS v4**, enfocada en micro-interacciones, diseño responsivo y estados de carga (Skeleton/Spinners).
- **Validación Robusta:** Uso de **Zod** en el backend para integridad de datos y **Axios** para comunicación asíncrona.

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

## 🏗️ Decisiones Arquitectónicas 

### 1. Control de Concurrencia Optimista (OCC)
En lugar de implementar bloqueos de base de datos ("Hard Locks") que pueden quedar huérfanos por fallos de red, se implementó un sistema de **Versiones**. Cada noticia tiene un campo `version`. Si dos usuarios intentan guardar cambios, el backend rechaza al segundo usuario cuya versión no coincida, obligándolo a refrescar y garantizando que ningún cambio se sobrescriba accidentalmente.

### 2. Middleware de Internacionalización
Se ubicó el middleware en la raíz de `src/` para interceptar todas las peticiones y redirigir automáticamente según el idioma del navegador o la preferencia del usuario, cumpliendo con los estándares modernos de SEO multilingüe.

---

## ⚙️ Configuración y Despliegue

### Variables de Entorno

**Backend (`/backend/.env`):**
```env
DATABASE_URL="tu_url_de_postgresql_en_render"
PORT=3001
