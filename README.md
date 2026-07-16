# 🎵 Goosebumps Records

Tienda en línea de vinilos con panel administrativo, desarrollada con **React.js**, **Node.js/Express** y **MongoDB**.

> Proyecto final del Módulo 3.8 — *Proyecto innovador de desarrollo de software* · Instituto Técnico Ricaldone.

---

## 📦 Estructura del proyecto

```
GoosebumpsRecordsAdmin/
├── backend/            # API REST (Express + Mongoose)
│   ├── scripts/        # Scripts de utilidad (crear admin)
│   └── src/
│       ├── config/     # Conexión a MongoDB
│       ├── controllers/
│       ├── models/     # Users, Vinyls, Orders, Reviews, Payments, Admin
│       ├── routes/
│       └── utils/      # Cloudinary, mailer (nodemailer)
├── frontend/           # Panel administrativo (React + Vite)
└── frontend-public/    # Tienda pública (React + Vite)
```

## 🛠️ Tecnologías

| Capa | Tecnologías |
|---|---|
| Frontend | React 18, Vite, React Router DOM, TailwindCSS (público), CSS Modules propios, Recharts (gráficas), SweetAlert2, Lucide Icons, Axios |
| Backend | Node.js, Express 5, Mongoose, JWT, bcryptjs, Nodemailer, Multer + Cloudinary |
| Base de datos | MongoDB Atlas |

## 🚀 Cómo ejecutar

### 1. Backend (puerto 4000)

```bash
cd backend
npm install
npm run dev
```

Requiere un archivo `.env` con:

| Variable | Descripción |
|---|---|
| `MONGO_URI` | Cadena de conexión a MongoDB Atlas |
| `JWT_SECRET` | Secreto para firmar los tokens |
| `EMAIL_USER` / `EMAIL_PASSWORD` | Cuenta Gmail para correos (confirmación y recuperación) |
| `CLOUDINARY_*` | Credenciales de Cloudinary para imágenes |

Para crear un administrador:

```bash
node scripts/createAdmin.js "Nombre Completo" correo@ejemplo.com contraseña
```

### 2. Panel administrativo (puerto 5173)

```bash
cd frontend
npm install
npm run dev
```

### 3. Tienda pública (puerto 5174)

```bash
cd frontend-public
npm install
npm run dev
```

## ✨ Funcionalidades

### 🛍️ Tienda pública (`frontend-public`)

- Registro de clientes con **confirmación de cuenta por correo** (código de 4 dígitos)
- Inicio de sesión con JWT y **recuperación de contraseña** por correo
- Catálogo de vinilos con búsqueda y categorías
- Sección de **vinilos más populares** calculada desde las ventas reales
- **Carrito de compras** persistente (agregar, quitar, actualizar cantidades, cupones)
- **Checkout completo**: dirección de envío, método de pago y confirmación
- La compra requiere **sesión iniciada y cuenta confirmada** (validado también en el servidor)
- **Historial de pedidos** con estado de cada orden
- **Valoraciones y reseñas** (solo de vinilos comprados, validado en el servidor)
- Notificaciones visuales con SweetAlert2

### 🔐 Panel administrativo (`frontend`)

- Login de administrador (colección separada, sin registro público)
- **Rutas protegidas**: sin sesión de admin se redirige al login
- Dashboard con **gráficas reales**: ventas por género e ingresos por mes (Recharts)
- Gestión completa (CRUD) de vinilos con imágenes en Cloudinary
- Gestión de órdenes con estados (pendiente → en proceso → enviado → entregado)
- Gestión de usuarios y pagos

## 🔌 API principal

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/customers/register` | Registro (envía código de confirmación) |
| `POST` | `/api/customers/verify-account` | Confirma la cuenta y entrega el token |
| `POST` | `/api/customers/login` | Login de cliente |
| `POST` | `/api/admin/login` | Login de administrador |
| `GET/POST` | `/api/vinyls` | Catálogo de vinilos |
| `GET` | `/api/vinyls/popular` | Vinilos más vendidos |
| `GET/POST` | `/api/orders` | Órdenes |
| `GET` | `/api/orders/user/:userId` | Historial de pedidos de un cliente |
| `GET` | `/api/orders/stats` | Métricas para el dashboard |
| `GET` | `/api/reviews/vinyl/:vinylId` | Reseñas de un vinilo |
| `POST` | `/api/reviews` | Crear/actualizar reseña (requiere compra) |
| `POST` | `/api/customer-recovery/*` | Recuperación de contraseña |

## 👥 Equipo

Proyecto desarrollado por estudiantes de 3er año de Desarrollo de Software — Instituto Técnico Ricaldone.
