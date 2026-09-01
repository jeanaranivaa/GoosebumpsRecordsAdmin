/** Validaciones de formularios reutilizadas en toda la aplicación. */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email) => EMAIL_REGEX.test(String(email).trim());

export const isValidPassword = (password) => String(password).length >= 6;

export const isValidFullName = (fullName) => String(fullName).trim().length >= 3;

export const isValidPhone = (phone) => {
  const clean = String(phone).replace(/[\s-]/g, "");
  return clean === "" || /^\+?\d{8,15}$/.test(clean);
};

export const isValidAddress = (address) => String(address).trim().length >= 5;

/** Valida el formulario de inicio de sesión y devuelve los errores por campo. */
export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = "El correo es obligatorio";
  } else if (!isValidEmail(email)) {
    errors.email = "Ingresa un correo válido";
  }

  if (!password) {
    errors.password = "La contraseña es obligatoria";
  }

  return errors;
};

/** Valida el formulario de registro y devuelve los errores por campo. */
export const validateSignUpForm = ({ fullName, email, password, confirmPassword, phone }) => {
  const errors = {};

  if (!fullName.trim()) {
    errors.fullName = "El nombre es obligatorio";
  } else if (!isValidFullName(fullName)) {
    errors.fullName = "El nombre debe tener al menos 3 caracteres";
  }

  if (!email.trim()) {
    errors.email = "El correo es obligatorio";
  } else if (!isValidEmail(email)) {
    errors.email = "Ingresa un correo válido";
  }

  if (!isValidPhone(phone)) {
    errors.phone = "Ingresa un teléfono válido (8 a 15 dígitos)";
  }

  if (!password) {
    errors.password = "La contraseña es obligatoria";
  } else if (!isValidPassword(password)) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }

  return errors;
};

/** Valida el formulario de perfil del cliente. */
export const validateProfileForm = ({ fullName, email, phone }) => {
  const errors = {};

  if (!isValidFullName(fullName)) {
    errors.fullName = "El nombre debe tener al menos 3 caracteres";
  }

  if (!isValidEmail(email)) {
    errors.email = "Ingresa un correo válido";
  }

  if (!isValidPhone(phone)) {
    errors.phone = "Ingresa un teléfono válido (8 a 15 dígitos)";
  }

  return errors;
};

/** Valida los datos de envío antes de confirmar una compra. */
export const validateCheckoutForm = ({ shippingAddress }) => {
  const errors = {};

  if (!isValidAddress(shippingAddress)) {
    errors.shippingAddress = "Ingresa una dirección de al menos 5 caracteres";
  }

  return errors;
};
