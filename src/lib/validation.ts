// Form validation utilities — German error messages

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_LETTER_REGEX = /[a-zA-Z]/;
const PASSWORD_NUMBER_REGEX = /[0-9]/;
const ZIP_REGEX = /^\d{5}$/;
const PHONE_REGEX = /^[+\d\s\-]+$/;

export function validateEmail(email: string): string | null {
  if (!email || email.trim().length === 0) {
    return 'E-Mail-Adresse ist erforderlich.';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password || password.length < 8) {
    return 'Das Passwort muss mindestens 8 Zeichen lang sein.';
  }
  if (!PASSWORD_LETTER_REGEX.test(password)) {
    return 'Das Passwort muss mindestens einen Buchstaben enthalten.';
  }
  if (!PASSWORD_NUMBER_REGEX.test(password)) {
    return 'Das Passwort muss mindestens eine Zahl enthalten.';
  }
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim().length === 0) {
    return `${fieldName} ist erforderlich.`;
  }
  return null;
}

export function validateZip(zip: string): string | null {
  if (!zip || zip.trim().length === 0) {
    return 'Postleitzahl ist erforderlich.';
  }
  if (!ZIP_REGEX.test(zip.trim())) {
    return 'Bitte geben Sie eine gültige Postleitzahl ein (5 Ziffern).';
  }
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone || phone.trim().length === 0) {
    return null;
  }
  const trimmed = phone.trim();
  if (!PHONE_REGEX.test(trimmed)) {
    return 'Bitte geben Sie eine gültige Telefonnummer ein.';
  }
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length < 6) {
    return 'Die Telefonnummer muss mindestens 6 Ziffern enthalten.';
  }
  return null;
}

export type ValidationErrors = Record<string, string>;

export function validateCheckoutForm(
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    street?: string;
    zip?: string;
    city?: string;
  },
  requireAddress: boolean,
): ValidationErrors {
  const errors: ValidationErrors = {};

  const firstNameError = validateRequired(data.firstName, 'Vorname');
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateRequired(data.lastName, 'Nachname');
  if (lastNameError) errors.lastName = lastNameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  if (data.phone !== undefined) {
    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.phone = phoneError;
  }

  if (requireAddress) {
    const streetError = validateRequired(data.street ?? '', 'Straße');
    if (streetError) errors.street = streetError;

    const zipError = validateZip(data.zip ?? '');
    if (zipError) errors.zip = zipError;

    const cityError = validateRequired(data.city ?? '', 'Stadt');
    if (cityError) errors.city = cityError;
  }

  return errors;
}

export function validateRegistration(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  const firstNameError = validateRequired(data.firstName, 'Vorname');
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateRequired(data.lastName, 'Nachname');
  if (lastNameError) errors.lastName = lastNameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  if (!data.confirmPassword || data.confirmPassword.length === 0) {
    errors.confirmPassword = 'Passwort-Bestätigung ist erforderlich.';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Die Passwörter stimmen nicht überein.';
  }

  return errors;
}
