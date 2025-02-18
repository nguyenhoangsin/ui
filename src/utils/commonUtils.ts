import * as _ from 'lodash';
import moment from 'moment';

export function convertBigNumberToNumber(
  big: bigint,
  decimals: number,
): number {
  const divisor = Math.pow(10, decimals);
  return Number(big) / divisor;
}

export function getRawAmount(num: number, decimals: number): number {
  return num * Math.pow(10, decimals);
}

export function getViewAmount(num: number, decimals: number): number {
  return num * Math.pow(10, -decimals);
}

/**
 * Convert a value with 'K' or 'M' suffix to a number.
 * 'K' is treated as 000 and 'M' as 000000.
 * @param value A string value to convert.
 * @returns The converted number.
 */
export function convertNumberStringWithSuffixToNumber(
  value: string | number,
): number {
  if (typeof value === 'number') {
    return value;
  }

  const numberValue = parseFloat(value);
  if (value.endsWith('K')) {
    return numberValue * 1000;
  } else if (value.endsWith('M')) {
    return numberValue * 1000000;
  }

  return numberValue; // Return original value if no suffix
}

/**
 * Dynamically rounds a number based on its magnitude.
 *
 * @param v - The number to be rounded.
 * @returns The rounded number as a string.
 *
 * Description:
 * - For numbers >= 1: Rounds the number to a dynamically determined number of decimal places
 *   based on its magnitude (at least 2 decimal places).
 * - For numbers < 1: Rounds the number with more precision (up to 4 additional decimal places
 *   based on its fractional part).
 */
export function roundNumberDynamic(v: number): string {
  // Get the absolute value of the input to handle negative numbers.
  const abs: number = Math.abs(Number(v));
  let rounded;

  if (abs >= 1) {
    // If the number is greater than or equal to 1:
    // Determine the number of decimal places as (5 - number of digits before the decimal point),
    // with a minimum of 2 decimal places.
    const decimal: number = Math.max(5 - Math.floor(abs).toString().length, 2);

    // Round the number to the determined decimal places.
    rounded = _.round(abs, decimal);
  } else {
    // If the number is less than 1:
    // Calculate the number of decimal places based on the length of the fractional part,
    // adding 4 additional decimal places for better precision.
    const decimal: number = Math.floor(1 / (abs % 1)).toString().length + 4;

    // Round the number to the determined decimal places.
    rounded = _.round(abs, decimal);
  }

  // Convert the rounded number to a string for consistent output format.
  return rounded.toString();
}

/**
 * Format a number into a more readable string, depending on its range.
 * @param number The number to format.
 * @returns A formatted string representation of the number.
 *
 * - If the number is 0, returns '0'.
 * - If the number is greater than 0.1:
 *   - If it's less than 1000, formats it with 4 significant digits.
 *   - Otherwise, formats it as a whole number.
 * - If the number is very small (< 0.1), formats it in scientific notation
 *   with subscripts for the exponent and up to 4 significant digits.
 */
export function formatTelegramNumber(number: number): string {
  // Case 1: If the number is exactly 0, return '0'
  if (!number) {
    return 'N/A';
  }

  // Case 2: If the number is greater than 0.1
  if (number > 0.1) {
    // For small numbers (< 1000), use 4 significant digits
    if (number < 1000) {
      return number.toPrecision(4);
    }
    // For larger numbers, return as a whole number
    return number.toFixed(0);
  }

  // Case 3: If the number is very small (< 0.1), format in scientific notation
  const scientificNotation = number.toExponential();
  const [coefficient, exponent] = scientificNotation
    .split('e')
    .map((part) => parseFloat(part));

  // Calculate the number of leading zeros from the exponent
  const leadingZeros = Math.abs(parseInt(exponent.toString(), 10)) - 1;

  // Extract the first 4 significant digits from the coefficient
  const significantDigits = coefficient.toString().replace('.', '').slice(0, 4);

  // Convert the exponent into subscript characters
  const subscriptZeros = String(leadingZeros)
    .split('')
    .map((digit) => String.fromCharCode(0x2080 + parseInt(digit)))
    .join('');

  // Return the formatted string with subscripts and significant digits
  return `0.${subscriptZeros}${significantDigits}`;
}

export function convertNumberToShortSuffix(v: number): string {
  const abs: number = Math.abs(Number(v));
  const currencySystem: string =
    // Nine Zeroes for Billions
    abs >= 1.0e9
      ? _.round(abs / 1.0e9, 3) + 'B'
      : // Six Zeroes for Millions
        abs >= 1.0e6
        ? _.round(abs / 1.0e6, 2) + 'M'
        : // Three Zeroes for Thousands
          abs >= 1.0e3
          ? _.round(abs / 1.0e3, 1) + 'K'
          : _.round(abs).toString();

  return currencySystem;
}

/**
 * Checks if the current time (in GMT+7) falls between midnight (00:00) and 7:00 AM.
 * @returns {boolean} - Returns `true` if the current time is between 00:00 and 06:59, otherwise `false`.
 */
export function isBetweenMidnightAnd7AM(): boolean {
  const now = moment().utcOffset(7); // Get the current time in GMT+7
  const hour = now.hour(); // Extract the hour (0 - 23)

  return hour >= 0 && hour < 7; // Return true if the hour is between 00:00 and 06:59
}

/**
 * Formats the time difference between a given timestamp and the current time.
 * Displays the largest time unit with 1 decimal place:
 * - Years (e.g., "1.2Y") if ≥ 1 year
 * - Months (e.g., "2.5M") if ≥ 1 month
 * - Days (e.g., "5.4D") if ≥ 1 day
 * - Hours (e.g., "3.7H") if ≥ 1 hour
 * - "Just now" if less than 1 hour
 *
 * @param {number} timestamp - The timestamp to compare (in milliseconds).
 * @returns {string} - Formatted time difference.
 */
export function formatTimeDifference(timestamp: number) {
  const now = moment(); // Get the current time
  const past = moment(timestamp); // Convert the given timestamp to a moment object
  const duration = moment.duration(now.diff(past)); // Calculate the time difference

  // Convert the duration to different time units
  const years = duration.asYears(); // Time difference in years (decimal)
  const months = duration.asMonths(); // Time difference in months (decimal)
  const days = duration.asDays(); // Time difference in days (decimal)
  const hours = duration.asHours(); // Time difference in hours (decimal)

  /**
   * Helper function to round a number to 1 decimal place.
   * @param {number} value - The number to round.
   * @returns {string} - Rounded number as a string (e.g., "1.2").
   */
  const round = (value: number) => value.toFixed(1);

  // Prioritize the largest unit of time and return the formatted value
  if (years >= 1) {
    return `${round(years)}y`; // Return years if ≥ 1 year
  } else if (months >= 1) {
    return `${round(months)}m`; // Return months if ≥ 1 month
  } else if (days >= 1) {
    return `${round(days)}d`; // Return days if ≥ 1 day
  } else if (hours >= 1) {
    return `${round(hours)}h`; // Return hours if ≥ 1 hour
  }

  // If the difference is less than 1 hour, return "Just now"
  return 'Just now';
}

export default {
  convertBigNumberToNumber,
  convertNumberStringWithSuffixToNumber,
  roundNumberDynamic,
  formatTelegramNumber,
  convertNumberToShortSuffix,
  isBetweenMidnightAnd7AM,
  formatTimeDifference,
};
