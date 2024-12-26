# MIME Types Database  

## What's This Database For? 
Think of this as a dictionary that helps your web server  
figure out what kind of files it's dealing with. It's like having a smart file organizer that knows  
exactly what each file type is used for.

## What's Inside? 📁
The database has three main pieces of info for each file type:
- **source**: Always says 'iana' (they're like the official record-keepers)
- **extensions**: The file endings you're familiar with (like .jpg, .png)
- **charset**: The text encoding (UTF-8 for text files, null for pictures and other binary stuff)

## The File Types Cover: 
1. 📝 Text Stuff
   - [JSON](https://www.json.org/json-en.html) files
   - [XML](https://www.w3schools.com/xml/) documents
   - [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) web pages
   - [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) style sheets
   - [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) code

2. 🖼️ Images
   - [PNG](https://en.wikipedia.org/wiki/Portable_Network_Graphics) pictures
   - [JPEG](https://en.wikipedia.org/wiki/JPEG) photos

3. 💻 Binary Files
   - EXE files
   - DLL files
   - Other binary data

We can add more types as needed.

## How to Use It
Just import it into your code like this:

```javascript
const mimeTypes = require('./mimeDb');
const jsonInfo = mimeTypes['application/json']; // Grabs JSON file info
```

This setup is super helpful when you're building web servers or handling file uploads.  
It helps make sure everything gets processed the right way! 🚀
        