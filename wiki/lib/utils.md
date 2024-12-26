# Utility Functions Documentation

This file contains various utility functions for handling HTTP requests, parsing JSON-like structures, and managing MIME types.

### MimeDb

There is a mimeDb object that maps MIME types to file extensions.  
You may find it at [lib\mimeDb.js](../../lib/mimeDb.js)

### Example Usage

```javascript
const { findFirstBrac, HTTPbody, JSONbodyParser, queryParser, lookupMimeType } = require('./lib/utils');

```

## Contents

### Functions

#### `findFirstBrac(req, target)`
Finds the index of the first occurrence of a target character in a given string.

- **Parameters**:
  - `req` (string): The string to search through.
  - `target` (string): The character to locate in the string.

- **Returns**: The index of the target character or `-1` if not found.

#### `HTTPbody(req, pos)`
Parses the HTTP body content starting from a given position.

- **Parameters**:
  - `req` (string): The HTTP request as a string.
  - `pos` (number): The starting position in the string for parsing.

- **Returns**: A `Promise` resolving to a cleaned-up body string.

#### `cleanUpBody(body)`
Cleans up body content by trimming spaces and standardizing spacing around colons and commas.

- **Parameters**:
  - `body` (Object): The content of the body.

- **Returns**: The cleaned-up body (Object).

#### `JSONbodyParser(body)`
Parses a JSON-like HTTP body structure into an object.

- **Parameters**:
  - `body` (string): The HTTP body as a string.

- **Returns**: The parsed JSON object.

#### `storePair(req, httpJSON)`
Stores key-value pairs from the HTTP request into a JSON object.

- **Parameters**:
  - `req` (Array<string>): The remaining characters of the request.
  - `httpJSON` (Object): The JSON object to store parsed data.

- **Returns**: The remaining unprocessed request characters (Array<string>).

#### `parseValue(req)`
Parses primitive values (strings, numbers, etc.) from the request array.

- **Parameters**:
  - `req` (Array<string>): The remaining characters of the request.

- **Returns**: The parsed value, either as a `string` or `number`.

#### `queryParser(request)`
Parses a query string from a request URL into a JSON object.

- **Parameters**:
  - `request` (string): The URL as a string.

- **Returns**: The parsed query parameters as a JSON object.

#### `lookupMimeType(extension)`
Looks up the MIME type based on a file extension.

- **Parameters**:
  - `extension` (string): The file extension.

- **Returns**: The MIME type as a `string`, or defaults to `'application/octet-stream'` if not found.

