# Changelog

All notable changes to this project will be documented in this file.
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

