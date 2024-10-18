const mimeDb = {
  'application/json': {
    source: 'iana',
    extensions: ['json'],
    charset: 'UTF-8'
  },
  'application/xml': {
    source: 'iana',
    extensions: ['xml'],
    charset: 'UTF-8'
  },
  'text/html': {
    source: 'iana',
    extensions: ['html', 'htm'],
    charset: 'UTF-8'
  },
  'text/css': {
    source: 'iana',
    extensions: ['css'],
    charset: 'UTF-8'
  },
  'text/javascript': {
    source: 'iana',
    extensions: ['js'],
    charset: 'UTF-8'
  },
  'image/png': {
    source: 'iana',
    extensions: ['png'],
    charset: null
  },
  'image/jpeg': {
    source: 'iana',
    extensions: ['jpeg', 'jpg'],
    charset: null
  },
  'application/octet-stream': {
    source: 'iana',
    extensions: ['bin', 'exe', 'dll'],
    charset: null
  }
  // Add more MIME types as needed
}

module.exports = mimeDb
