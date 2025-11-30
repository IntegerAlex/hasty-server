/**
 * @typedef {Object} CorsHeaders
 * @property {string} 'Access-Control-Allow-Origin' - The origin(s) allowed to access the resource
 * @property {string} 'Access-Control-Allow-Methods' - The HTTP methods allowed when accessing the resource
 * @property {string} 'Access-Control-Allow-Headers' - The headers that can be used during the actual request
 * @property {string} 'Access-Control-Max-Age' - How long the results of a preflight request can be cached
 */

/**
 * Default CORS headers
 * @type {CorsHeaders}
 */
const DEFAULT_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Access-Control-Allow-Credentials': 'true'
}

/**
 * Applies CORS headers to a response
 * @param {Object} response - The response object to modify
 * @param {boolean} [enabled=true] - Whether CORS is enabled
 * @param {Object} [customHeaders] - Custom CORS headers to merge with defaults
 * @returns {void}
 */
function applyCorsHeaders (response, enabled = true, customHeaders = {}) {
  if (!enabled) return

  const headers = { ...DEFAULT_CORS_HEADERS, ...customHeaders }

  Object.entries(headers).forEach(([key, value]) => {
    // Only set if explicitly provided in customHeaders or if not already set
    if (customHeaders[key] || !response.headers[key]) {
      response.setHeader(key, value)
    }
  })
}

/**
 * Handles preflight OPTIONS requests
 * @param {Object} request - The request object
 * @param {Object} response - The response object
 * @param {boolean} [enabled=true] - Whether CORS is enabled
 * @returns {boolean} - True if this was a preflight request that was handled
 */
function handlePreflight (request, response, enabled = true) {
  if (!enabled || request.method !== 'OPTIONS') {
    return false
  }

  applyCorsHeaders(response, true, {
    'Access-Control-Allow-Methods': request.headers['access-control-request-method'] ||
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Methods'],
    'Access-Control-Allow-Headers': request.headers['access-control-request-headers'] ||
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Headers']
  })

  response.status(204).send('')
  return true
}

module.exports = {
  applyCorsHeaders,
  handlePreflight,
  DEFAULT_CORS_HEADERS
}
