# Changelog

All notable changes to this project will be documented in this file.

## [0.9.6] - 2025-08-01
### Updated
- Updated License to LGPL-2.1-only.

### Added Core Enhancements
- Enhanced server/index.js with comprehensive JSDoc type definitions
- Added improved routing with deterministic parameter handling
- Integrated CORS support with automatic preflight OPTIONS handling
- Added static file serving with security protections
- Enhanced response.js with chainable API and improved error handling
- Added robust file serving capabilities with directory traversal protection
- Implemented connection timeout and error handling for sockets
- Added detailed type definitions for better IDE support

### Fixed Core Issues
- Fixed route parameter extraction with safe URL decoding
- Improved error handling in response methods
- Added proper MIME type detection for static files
- Enhanced socket error handling and cleanup
- Fixed CORS preflight response handling

### Added Utilities
- Created lib/cors.js utility for centralized CORS handling
- Enhanced lib/httpParser.js with safe fallbacks
- Added comprehensive utils for MIME type detection
- Added robust path normalization and security checks

### Documentation
- Added comprehensive JSDoc documentation for all public APIs
- Created detailed type definitions for TypeScript compatibility
- Added inline documentation for complex functions

## [0.9.5] - 2025-03-06
### Added
- Added 'OPTIONS' method to handle preflight requests for CORS.

## [0.9.4] - 2025-03-05
### Added 
- Added req.ip to get the IP address of the client. 

## [0.9.3] - 2025-03-04
### Fixed
- Fixed the issue of res.end() 

## [0.9.3] - 2025-03-04
### Fixed
- Added Headers in response objects

## [0.9.0] - 2024-12-31
### Fixed
- minor bug fixes

### Updated
-  Updated License to GOFL-V1 License

## [0.8.0] - 2024-10-10
### Fixed
- Fixed the issue of `res.download()` not sending the correct response.

### Added
- Added support for `cors` middleware to enable Cross-Origin Resource Sharing.
    -  which is in built by using  `server.cors(true)` to enable cors.
- Added support for `params` in routes. Now you can define routes with parameters like `/users/:id` and access the parameter value using `req.params.id`.
- Added `download()` method to the response object `res.download()`.

## [0.6.0] - 2024-10-09
### Fixed
- HTTPParserError: Response does not match the HTTP/1.1 protocol (Invalid header value char)
   -  The issue was due to using `\n` instead of `\r\n` to terminate header lines. Each header should end with `\r\n` for proper protocol compliance.


### Added
- Added `sendFile()` method to send files as response.
- Added `server.close()` This method has been implemented to explicitly close the server when necessary.
- Added  mime-types library to handle content-type for files.

## [0.5.6] - 2024-10-05
### Fixed
- Fixed the issue of POST requests containing BODY data not being parsed correctly.

##  [0.5.5] - 2024-10-02
### Added
- Added Chaining of response methods.
- Added support for PUT, DELETE, PATCH, HEAD, OPTIONS HTTP methods. 
- Added support for setting status code in response

### Fixed
- Fixed same path but different methods not being handled correctly.
- Fixed issue of `res.json()` not sending the correct response.


## [0.5.4] - 2024-10-01
### Added 
- Added support for sending  JSON responses using `res.json()` method.


## [0.5.3] - 2024-09-29
### Fixed
- Fixed the issue of Npm main entry point not being set correctly.

## [0.5.2] - 2024-09-29
### Fixed
- Fixed Issue of same path but different methods not being handled correctly.
- Fixed Issue of `res.send()` not sending the correct response.

### Added
- Added support for handling multiple routes with the same path but different methods.
- Created new Response class to handle response sending.

## [0.5.1] - 2024-09-29
### Fixed
- Fixed response handling where extra quotes were added to strings.

### Added
- Implemented `res.send()` abstraction to simplify response handling.

---

## [0.5.0] - 2024-09-29
### Fixed
- Issue where POST requests were not being parsed correctly.
- Issue where Nested JSON objects were not being parsed correctly.

### Added
- Initial release of HTTP server with support for basic routing.
- Implemented custom JSON parser for handling incoming HTTP requests.

---

## [0.0.2] - 2024-09-23
### Added
- Basic functionality for parsing GET and POST requests.
- Custom path routing support.

