/*
 * Returns true if val is a real number (not infinity or NaN)
 * @param {number} val
 * @returns {boolean} true if val is a real number
 */
export const isNumber = (val) => typeof val === "number" && val !== Infinity && val !== -Infinity && !Number.isNaN(val);
