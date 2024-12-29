---
id: cors
title: Cross-Origin Resource Sharing (CORS)
sidebar_position: 3
---

## Cross-Origin Resource Sharing (CORS)

Cross-Origin Resource Sharing (CORS) is a mechanism that allows resources on a web page to be requested from another domain outside the domain from which the resource originated. CORS is a security feature implemented by web browsers to prevent unauthorized access to resources on a different domain.

for example, if you have a website hosted on `https://example.com` and you want to make a request to an API hosted on `https://api.example.com`, the browser will block the request by default due to the same-origin policy. CORS allows you to configure the server to allow requests from specific domains.

### Enabling CORS in Hasty server
 
To enable CORS in a Hasty server, you can use the `cors` middleware provided by the `hasty-server` package. The `cors` middleware allows you to configure the server to allow requests from specific domains.

To use the `cors` middleware, you need to install the `hasty-server` package:

```js title="Enable CORS in Hasty server"
const Hasty = require('hasty-server');
const server = new Hasty();
server.cors(true);
```

The `cors` method accepts a boolean value to enable or disable CORS. By default, CORS is disabled in the Hasty server. When you enable CORS, the server will allow requests from all domains. You can also configure the server to allow requests from specific domains by passing an array of domains to the `cors` method:

**Currently in development**
