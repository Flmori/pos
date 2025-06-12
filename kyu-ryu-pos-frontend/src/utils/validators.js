// Validator functions

export const isRequired = (value) => value !== undefined && value !== null && value !== '';

export const isEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};
