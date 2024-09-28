# Changelog

All notable changes to this project will be documented in this file.

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

