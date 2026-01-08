// utils/validators.js

/**
 * Allows letters (A–Z, a–z) and spaces only
 * ❌ No numbers
 * ❌ No special characters
 */
export const isAlphaSpaceOnly = (value) => {
    if (typeof value !== "string") return false;
    return /^[A-Za-z ]+$/.test(value.trim());
};
