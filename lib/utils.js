/**
 * Parse query parameters from a URL string
 * @param {string} queryString - URL query string
 * @returns {Object} Parsed query parameters
 * @example
 * queryParser('name=john&age=25')
 * // Returns { name: 'john', age: '25' }
 */
function queryParser(queryString) {
  const query = {};
  if (!queryString) return query;

  const pairs = queryString.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=').map(decodeURIComponent);
    if (key) {
      query[key] = value || '';
    }
  }
  return query;
}

/**
 * Store key-value pair in JSON object
 * @param {string[]} req - Request array
 * @param {Object} httpJSON - Target object
 * @private
 */
function storePair(req, httpJSON) {
  let key = '';
  let value = '';
  let inKey = true;

  while (req.length > 0 && req[0] !== '}') {
    const char = req.shift();
    if (char === ':') {
      inKey = false;
    } else if (char === ',') {
      if (key) {
        httpJSON[key.trim()] = value.trim();
      }
      key = '';
      value = '';
      inKey = true;
    } else {
      if (inKey) {
        key += char;
      } else {
        value += char;
      }
    }
  }

  // Store the last pair
  if (key) {
    httpJSON[key.trim()] = value.trim();
  }
}

/**
 * Parse JSON body from request
 * @param {string} body - Request body
 * @returns {Object} Parsed JSON object
 * @example
 * JSONbodyParser('{"name": "john", "age": 25}')
 * // Returns { name: 'john', age: 25 }
 */
function JSONbodyParser(body) {
  const req = body.split('');
  const httpJSON = {};

  // Check for empty input
  if (req.length < 1) return httpJSON;

  // Skip initial whitespace and opening brace
  while (req.length > 0 && /\s/.test(req[0])) {
    req.shift();
  }

  if (req[0] === '{') {
    req.shift(); // Skip opening brace
    storePair(req, httpJSON);
  }

  return httpJSON;
}

module.exports = {
  queryParser,
  JSONbodyParser
};
