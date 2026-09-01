# 📱 Goosebumps Records — Aplicación móvil

Aplicación móvil de la tienda en línea **Goosebumps Records**, desarrollada con
**React Native + Expo**. Consume la misma API REST y reutiliza el diseño, la
paleta de colores y los componentes de la tienda web (`frontend-public`).

> Proyecto Técnico Científico · Módulo 5: *Desarrollo de componentes para
> dispositivos móviles* · Instituto Técnico Ricaldone — 3° año de Desarrollo de
> Software.

---

## 👥 Equipo

| Nombre | Rol | Correo institucional |
|---|---|---|
| *(Completar)* | Desarrollo móvil | *(Completar)* |
| *(Completar)* | Desarrollo móvil | *(Completar)* |
| *(Completar)* | Backend / API | *(Completar)* |
| *(Completar)* | Diseño UI (Figma) | *(Completar)* |

---

## 🧩 Descripción del proyecto

La app permite a un cliente de la tienda:

- Ver una **pantalla de carga personalizada** y un **onboarding** de bienvenida.
- **Registrarse** y **confirmar su cuenta** con un código de 4 dígitos enviado
  por correo.
- **Iniciar sesión** con un usuario real de la base de datos.
- **Recuperar su contraseña** (envío de código → verificación → nueva contraseña).
- Explorar el **catálogo de vinilos** traído desde MongoDB, con buscador y
  vinilos más vendidos.
- Navegar por **categorías** (géneros) generadas dinámicamente.
- Ver el **detalle de un vinilo**, con stock, precio y valoraciones.
- **Agregar al carrito**, modificar cantidades y aplicar **cupones**.
- **Finalizar la compra**: dirección de envío, método de pago y confirmación.
- Consultar su **historial de pedidos**, ver el detalle y **cancelar** los que
  siguen pendientes.
- **Valorar** los vinilos que ya compró (1 a 5 estrellas + comentario).
- **Editar sus datos** de perfil (nombre, correo y teléfono).

---

## 🗄️ Datos y tablas usadas

La app lee y escribe datos reales de la base de datos a través de la API:

| Colección | Lectura | Escritura desde la app |
|---|---|---|
| `Users` | Perfil del cliente | Registro (CREATE) y edición de perfil (UPDATE) |
| `Vinyls` | Catálogo, populares, detalle | — (se administra desde el panel web) |
| `Orders` | Historial y detalle | Crear pedido (CREATE) y cancelar (UPDATE) |
| `Reviews` | Reseñas por vinilo | Crear/actualizar reseña (UPSERT) |
| `Payments` | — | Registrar el pago del pedido (CREATE) |
| `RecoveryCodes` | — | Códigos de confirmación y recuperación (CREATE) |

---

## 🛠️ Dependencias instaladas

Además de las que trae la plantilla `blank` de Expo:

| Dependencia | Para qué se usa |
|---|---|
| `@react-navigation/native` | Base de la navegación |
| `@react-navigation/native-stack` | Pilas de pantallas (raíz y autenticación) |
| `@react-navigation/bottom-tabs` | Menú inferior de la aplicación |
| `react-native-screens` | Optimización de pantallas nativas |
| `react-native-safe-area-context` | Áreas seguras (notch, barra de estado) |
| `react-native-gesture-handler` | Gestos requeridos por la navegación |
| `@react-native-async-storage/async-storage` | Sesión y carrito persistentes |
| `axios` | Cliente HTTP hacia la API |
| `expo-constants` | Detecta la IP del servidor de desarrollo |
| `expo-linear-gradient` | Degradados de la marca |
| `expo-splash-screen` | Control del Splash Screen nativo |
| `expo-font` + `@expo-google-fonts/poppins` | Tipografía Poppins (igual que la web) |
| `lucide-react-native` + `react-native-svg` | Íconos (los mismos de la web) |

Instalación:

```bash
cd app
npm install
```

---

## ⚙️ Configuraciones adicionales

### 1. Conexión con la API

`src/api/apiClient.js` arma la URL base automáticamente: toma la IP de la
computadora desde el servidor de Expo (`Constants.expoConfig.hostUri`) y le
agrega el puerto **4000**. Así funciona en un teléfono físico sin editar código.

```js
// Resultado típico en un dispositivo real
http://192.168.0.15:4000/api
```

Si se usa otro puerto, se cambia la constante `API_PORT` en ese archivo.

> El backend acepta los orígenes `localhost:5173-5175` (web) y `localhost:8081`
> (Expo Web). La app nativa no aplica CORS.

### 2. Splash Screen e íconos

En `app.json` se configuraron:

- `icon` → `./assets/icon.png` (ícono de la aplicación).
- `android.adaptiveIcon.foregroundImage` → `./assets/adaptive-icon.png`, con
  fondo `#0c0d15`.
- `plugins → expo-splash-screen` → `./assets/splash-icon.png` sobre el fondo
  oscuro de la marca.
- `web.favicon` → `./assets/favicon.png`.

Todos los íconos fueron diseñados para el proyecto (disco de vinilo con la
etiqueta rosa/morada de la marca).

### 3. Tipografía y tema

`src/theme/` centraliza colores, tipografías, espaciados y radios. Los valores
son exactamente los mismos del sitio web (fondo `#0c0d15`, superficie `#14162a`,
rosa `#ec4899`, morado `#8b5cf6`, tipografía Poppins).

---

## ▶️ Cómo ejecutar

1. Levantar el backend (desde la raíz del repositorio):

```bash
cd backend
npm install
npm run dev          # http://localhost:4000
```

2. Levantar la aplicación móvil:

```bash
cd app
npm install
npm start            # abre Expo; escanear el QR con Expo Go
```

También:

```bash
npm run android      # emulador o dispositivo Android
npm run ios          # simulador de iOS (solo macOS)
npm run web          # versión web de la app
```

> El teléfono y la computadora deben estar en la **misma red Wi-Fi**.

---

## 📁 Estructura de carpetas

`App.js` solo contiene los proveedores globales y la navegación; toda la lógica
vive dentro de `src/`.

```
app/
├── App.js                      # Proveedores + <AppNavigator />
├── index.js                    # Registro del componente raíz (Expo)
├── app.json                    # Íconos, splash screen y configuración
├── assets/                     # Íconos, splash e imágenes de la marca
└── src/
    ├── api/
    │   └── apiClient.js        # Axios + token en cada petición
    ├── components/             # Componentes reutilizables
    │   ├── AppHeader.jsx
    │   ├── AuthCard.jsx
    │   ├── CartItemCard.jsx
    │   ├── CategoryCard.jsx
    │   ├── CodeInput.jsx
    │   ├── CustomTextInput.jsx
    │   ├── EmptyState.jsx
    │   ├── GhostButton.jsx
    │   ├── HeroBanner.jsx
    │   ├── LoadingState.jsx
    │   ├── OrderCard.jsx
    │   ├── PrimaryButton.jsx
    │   ├── ProfileOption.jsx
    │   ├── QuantitySelector.jsx
    │   ├── RequireAuth.jsx
    │   ├── ReviewItem.jsx
    │   ├── ScreenContainer.jsx
    │   ├── SearchBar.jsx
    │   ├── SectionHeader.jsx
    │   ├── SpinningVinyl.jsx
    │   ├── StarRating.jsx
    │   ├── StatusBadge.jsx
    │   ├── SummaryRow.jsx
    │   ├── VinylCard.jsx
    │   └── VinylCover.jsx
    ├── context/                # Estado global
    │   ├── AuthContext.js      # Sesión del cliente
    │   ├── CartContext.js      # Carrito persistente
    │   └── FeedbackContext.js  # Notificaciones flotantes
    ├── hooks/                  # Acceso a la API por entidad
    │   ├── orders/
    │   ├── payments/
    │   ├── reviews/
    │   ├── users/
    │   ├── vinyls/
    │   ├── useAppFonts.js
    │   ├── useOnboarding.js
    │   └── useRecovery.js
    ├── navigation/
    │   ├── AppNavigator.jsx      # Navegación raíz
    │   ├── AuthNavigator.jsx     # Login, registro y recuperación
    │   ├── MainTabNavigator.jsx  # Menú inferior
    │   └── navigationTheme.js
    ├── screens/
    │   ├── LoadingScreen.jsx     # Pantalla de carga personalizada
    │   ├── OnboardingScreen.jsx  # Bienvenida (primera vez)
    │   ├── auth/                 # 6 pantallas de autenticación
    │   ├── orders/               # Pedidos y detalle
    │   ├── profile/              # Perfil y edición
    │   └── store/                # Inicio, categorías, detalle, carrito, compra
    ├── theme/                    # Colores, tipografía y espaciados
    └── utils/                    # Formateo y validaciones
```

---

## 🧭 Pantallas y navegación

**Menú inferior (Bottom Tabs):** Inicio · Categorías · Carrito (con contador) ·
Pedidos · Perfil.

Las pantallas que no están en el menú se abren desde una pila y siempre tienen
botón de regreso en la cabecera:

```
LoadingScreen → OnboardingScreen (primera vez)
        │
        └── MainTabs
              ├── Home ──────────► VinylDetail
              ├── Categories ────► CategoryVinyls ──► VinylDetail
              ├── Cart ──────────► Checkout
              ├── MyOrders ──────► OrderDetail
              └── Profile ───────► EditProfile
        │
        └── Auth (Login → SignUp → VerifyAccount)
                       └► PasswordRecovery → VerifyCode → NewPassword
```

Las pantallas privadas (Carrito, Pedidos y Perfil) usan el componente
`RequireAuth`, que muestra un aviso con acceso directo al inicio de sesión
cuando no hay sesión activa.

---

## ✅ Validaciones de datos

Centralizadas en `src/utils/validators.js` y mostradas debajo de cada campo:

- **Correo**: formato válido y obligatorio.
- **Contraseña**: mínimo 6 caracteres; confirmación que debe coincidir.
- **Nombre**: mínimo 3 caracteres.
- **Teléfono**: opcional, de 8 a 15 dígitos.
- **Dirección de envío**: mínimo 5 caracteres (máximo 150, igual que la API).
- **Código de verificación**: solo dígitos, 4 casillas completas.
- **Reseña**: calificación obligatoria de 1 a 5, comentario de hasta 500
  caracteres.
- **Cantidades**: nunca menores a 1 ni mayores al stock disponible.

El servidor vuelve a validar todo, y los mensajes de error de la API se muestran
en las notificaciones.

---

## 🔤 Nomenclaturas

Se usa una sola convención en todo el proyecto:

| Elemento | Convención | Ejemplo |
|---|---|---|
| Variables y funciones | `camelCase` | `handleAddToCart`, `shippingAddress` |
| Funciones de evento | `handle` + acción | `handleLogin`, `handleSaveReview` |
| Booleanos | `is` / `has` + estado | `isSoldOut`, `hasSeenOnboarding` |
| Componentes y pantallas | `PascalCase` | `VinylCard`, `CheckoutScreen` |
| Archivos de componentes | `PascalCase.jsx` | `OrderCard.jsx` |
| Hooks | `use` + entidad | `useVinyls`, `useCreateOrder` |
| Constantes | `UPPER_SNAKE_CASE` | `PAYMENT_METHODS`, `MINIMUM_LOADING_MS` |
| Rutas de navegación | `PascalCase` | `VinylDetail`, `MyOrders` |

Todo el código y los comentarios están en español, igual que el resto del
proyecto.
