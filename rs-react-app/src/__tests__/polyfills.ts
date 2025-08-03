// Polyfills needed for React Router and modern web APIs in Jest environment

// TextEncoder/TextDecoder for React Router
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, {
  TextEncoder,
  TextDecoder,
});

// URL and URLSearchParams polyfills if needed
import { URL, URLSearchParams } from 'url';

Object.assign(global, {
  URL,
  URLSearchParams,
});
