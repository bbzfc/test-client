// Should the app automatically reload?
// See `RELOAD_APP_TIMEOUT` below.
// Useful for testing purposes only.
// The default is `false` (boolean).
const RELOAD_APP_FOREVER: boolean = (() => {
  let rawValue;
  try {
    rawValue = process.env.MY_APP_RELOAD_APP_FOREVER;
  } catch (e) {
    return null;
  }

  if (typeof rawValue !== 'string' || rawValue.length === 0) {
    return null;
  }

  const value = rawValue.trim().toLowerCase();

  if (value !== 'true') {
    return null;
  }

  return true;
})() || false;

// How often to reload the app automatically; value is treated as seconds.
// See `RELOAD_APP_FOREVER` above.
// Should be more than `0.5` and less than `60`.
// The default is `3` (number).
const RELOAD_APP_TIMEOUT: number = (() => {
  let rawValue;
  try {
    rawValue = process.env.MY_APP_RELOAD_APP_TIMEOUT;
  } catch (e) {
    return null;
  }

  if (typeof rawValue !== 'string' || rawValue.length === 0) {
    return null;
  }

  const value = rawValue.trim();

  const numericValue = Number.parseFloat(value);

  if (Number.isNaN(numericValue)) {
    return null;
  }

  if (numericValue < 0.5 || numericValue > 60) {
    return null;
  }

  return numericValue;
})() || 3;

// Should extra debug information be written via `console.log()`?
// Useful for testing purposes only.
// The default is `false` (boolean).
const ENABLE_EVENT_CONSOLE_LOG: boolean = (() => {
  let rawValue;
  try {
    rawValue = process.env.MY_APP_ENABLE_EVENT_CONSOLE_LOG;
  } catch (e) {
    return null;
  }

  if (typeof rawValue !== 'string' || rawValue.length === 0) {
    return null;
  }

  const value = rawValue.trim().toLowerCase();

  if (value !== 'true') {
    return null;
  }

  return true;
})() || false;

function removeAllTrailingSlashes(str: string): string {
  let i = str.length - 1;

  while (str[i] === '/') {
    i -= 1;
  }

  return str.slice(0, i + 1);
}

// Base URL where the asset resources are hosted (for example, gltf models).
// The default is `` (string).
const ASSETS_BASE_URL: string = (() => {
  let rawValue;
  try {
    rawValue = process.env.MY_APP_ASSETS_BASE_URL;
  } catch (e) {
    return null;
  }

  if (typeof rawValue !== 'string' || rawValue.length === 0) {
    return null;
  }

  const value = removeAllTrailingSlashes(rawValue.trim());

  return value;
})() || '';

export {
  RELOAD_APP_FOREVER,
  RELOAD_APP_TIMEOUT,
  ENABLE_EVENT_CONSOLE_LOG,
  ASSETS_BASE_URL,
};
