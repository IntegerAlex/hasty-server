---
title: Error Handling in Hasty Server
description: Learn how to handle and manage errors effectively in your Hasty Server applications
---

# 🚨 Error Handling in Hasty Server

Proper error handling is crucial for building reliable and maintainable applications. This guide covers various error handling techniques in Hasty Server, from basic error handling to advanced patterns.

## Table of Contents
- [Basic Error Handling](#basic-error-handling)
- [Error-First Callbacks](#error-first-callbacks)
- [Async/Await Error Handling](#asyncawait-error-handling)
- [Custom Error Classes](#custom-error-classes)
- [Error Handling Middleware](#error-handling-middleware)
- [Handling Uncaught Exceptions](#handling-uncaught-exceptions)
- [Validation Errors](#validation-errors)
- [Logging Errors](#logging-errors)
- [Best Practices](#best-practices)
- [Example: Complete Error Handling Setup](#example-complete-error-handling-setup)

## Basic Error Handling

In Hasty Server, you can handle errors in route handlers using try/catch blocks:

```javascript
app.get('/api/users/:id', (req, res) => {
  try {
    const user = getUserById(req.params.id);
    if (!user) {
      // Throw a custom error
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    res.json(user);
  } catch (error) {
    // Handle the error
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});
```

## Error-First Callbacks

When working with Node.js-style callbacks, use the error-first pattern:

```javascript
const fs = require('fs');

app.get('/file', (req, res, next) => {
  fs.readFile('/path/to/file', 'utf8', (err, data) => {
    if (err) {
      // Pass the error to the error handling middleware
      return next(err);
    }
    res.send(data);
  });
});
```

## Async/Await Error Handling

For async/await syntax, use try/catch blocks:

```javascript
const getUserFromDb = async (id) => {
  // Simulate async operation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = { id: 1, name: 'John Doe' };
      if (id == 1) {
        resolve(user);
      } else {
        reject(new Error('User not found'));
      }
    }, 100);
  });
};

app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await getUserFromDb(req.params.id);
    res.json(user);
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
});
```

## Custom Error Classes

Create custom error classes for different types of errors:

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(errors, message = 'Validation failed') {
    super(message, 400);
    this.errors = errors;
  }
}

// Usage
app.get('/api/users/:id', (req, res, next) => {
  const user = getUserById(req.params.id);
  if (!user) {
    return next(new NotFoundError('User not found'));
  }
  res.json(user);
});
```

## Error Handling Middleware

Define error-handling middleware with four arguments (err, req, res, next):

```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Handle Mongoose validation error
    const errors = Object.values(err.errors).map(el => el.message);
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid input data',
      errors
    });
  }

  if (err.code === 11000) {
    // Handle duplicate field error
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value: ${field}. Please use another value.`;
    return res.status(400).json({
      status: 'fail',
      message
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Your token has expired. Please log in again.'
    });
  }

  // For other operational errors that we trust
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // 1) Log the error
  console.error('ERROR 💥', err);

  // 2) Send generic message
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
});
```

## Handling Uncaught Exceptions

Handle uncaught exceptions and unhandled promise rejections:

```javascript
// Handle uncaught exceptions (synchronous errors)
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  
  // Close server and exit process
  server.close(() => {
    process.exit(1); // 1 stands for uncaught exception
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  
  // Close server and exit process
  server.close(() => {
    process.exit(1);
  });
});
```

## Validation Errors

Handle request validation errors using a validation library like Joi:

```javascript
const Joi = require('joi');

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.context.key,
      message: detail.message
    }));
    
    return next(new ValidationError(errors));
  }
  
  next();
};

app.post('/api/users', validateUser, (req, res, next) => {
  // If we get here, the request is valid
  // Create user logic here
  res.status(201).json({ status: 'success', data: { user: newUser } });
});
```

## Logging Errors

Implement a logging system for your errors:

```javascript
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, json } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    process.env.NODE_ENV === 'development' 
      ? combine(colorize(), logFormat)
      : json()
  ),
  transports: [
    // Write all logs with level 'error' and below to 'error.log'
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs to 'combined.log'
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(colorize(), logFormat)
  }));
}

// Use the logger in your error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Rest of the error handling...
});
```

## Best Practices

1. **Use Custom Error Classes**: Create specific error types for different scenarios.

2. **Centralize Error Handling**: Use middleware to handle errors in one place.

3. **Log All Errors**: Keep a record of all errors for debugging and monitoring.

4. **Don't Leak Sensitive Information**: Be careful about what error details you send to clients.

5. **Handle Uncaught Exceptions**: Prevent your application from crashing.

6. **Use HTTP Status Codes Correctly**: Follow REST conventions for status codes.

7. **Validate User Input**: Catch errors as early as possible.

8. **Use Async/Await with Try/Catch**: For cleaner asynchronous error handling.

## Example: Complete Error Handling Setup

Here's a complete example of error handling in a Hasty Server application:

```javascript
const Hasty = require('hasty-server');
const app = new Hasty();

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Routes
app.get('/api/users/:id', (req, res, next) => {
  const userId = parseInt(req.params.id);
  
  if (isNaN(userId)) {
    return next(new AppError('Invalid user ID', 400));
  }
  
  // Simulate fetching user from database
  const user = { id: 1, name: 'John Doe' };
  
  if (userId !== 1) {
    return next(new AppError('User not found', 404));
  }
  
  res.json({ status: 'success', data: { user } });
});

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid input data',
      errors
    });
  }

  // For other operational errors that we trust
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // 1) Log the error
  console.error('ERROR 💥', err);

  // 2) Send generic message
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
```

## Conclusion

Effective error handling is essential for building robust and maintainable applications. By implementing the patterns and best practices outlined in this guide, you can ensure that your Hasty Server application handles errors gracefully and provides meaningful feedback to users while maintaining system stability.
