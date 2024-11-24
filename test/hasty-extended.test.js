const Hasty = require("../server/index");
const fs = require("fs");
const path = require("path");

describe("Hasty Server Extended Tests", () => {
  let server;

  beforeEach(() => {
    server = new Hasty();
  });

  afterEach(async () => {
    if (server) {
        await new Promise(resolve => {
            server.close();
            setTimeout(resolve, 100); // Give some time for cleanup
        });
    }
});

  // Test chained response methods
  test("should handle chained response methods", async () => {
    const PORT = 3000; // Define PORT constant
    const route = "/chain";
    
    server = new Hasty();
    server.get(route, (req, res) => {
        res.status(201).json({ message: "Created" });
    });

    // Wrap server startup in try-catch
    try {
        await new Promise(resolve => server.listen(PORT, resolve));

        const response = await fetch(`http://localhost:${PORT}${route}`);
        const data = await response.json();      

        expect(response.status).toBe(201);
        expect(data).toEqual({ message: "Created" });
    } catch (error) {      
      console.log("Error in chained response methods test:");
        throw error;
    } finally {
        // Ensure server is closed even if test fails
        if (server) {
            server.close();
        }
    }
}, 10000);

  // Test different HTTP methods on same route
  test("should handle different HTTP methods on same route", (done) => {
    server = new Hasty();

    server.get("/multi-method", (req, res) => {
      res.send("GET response");
    });

    server.post("/multi-method", (req, res) => {
      res.send("POST response");
    });

    server.listen(3002, () => {
      // Changed port to 3002
      Promise.all([
        fetch("http://localhost:3002/multi-method"),
        fetch("http://localhost:3002/multi-method", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ])
        .then(([getRes, postRes]) => {
          return Promise.all([getRes.text(), postRes.text()]);
        })
        .then(([getText, postText]) => {
          expect(getText).toBe("GET response");
          expect(postText).toBe("POST response");
          server.close();
          done();
        })
        .catch((error) => {
          server.close();
          done(error);
        });
    });
  }, 15000); // Increased timeout to 15 seconds

  // Test CORS functionality
  test("should handle CORS when enabled", (done) => {
    server = new Hasty();
    server.cors(true);

    server.get("/cors-test", (req, res) => {
      res.send("CORS enabled response");
    });

    server.listen(3000, () => {
      fetch("http://localhost:3000/cors-test").then((response) => {
        expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
        server.close();
        done();
      });
    });
  }, 5000);

  // Test route parameters
  test("should handle route parameters correctly", (done) => {
    server = new Hasty();

    server.get("/users/:id", (req, res) => {
      res.json({ id: req.params.id });
    });

    server.listen(3000, () => {
      fetch("http://localhost:3000/users/123")
        .then((response) => response.json())
        .then((data) => {
          expect(data).toEqual({ id: "123" });
          server.close();
          done();
        });
    });
  }, 5000);

  // Test file download functionality
  test("should handle file downloads", (done) => {
    server = new Hasty();
    const testFilePath = path.join(__dirname, "test-file.txt");

    // Create a test file
    fs.writeFileSync(testFilePath, "Test content");

    server.get("/download", (req, res) => {
      res.download(testFilePath, "downloaded.txt");
    });

    server.listen(3000, () => {
      fetch("http://localhost:3000/download").then((response) => {
        expect(response.headers.get("Content-Disposition")).toBe(
          'attachment; filename="downloaded.txt"'
        );
        fs.unlinkSync(testFilePath); // Clean up test file
        server.close();
        done();
      });
    });
  }, 5000);

  // Test response status codes
  test("should handle different status codes", (done) => {
    server = new Hasty();

    server.get("/not-found", (req, res) => {
      res.status(404).json({ error: "Not found" });
    });

    server.listen(3000, () => {
      fetch("http://localhost:3000/not-found")
        .then((response) => {
          expect(response.status).toBe(404);
          return response.json();
        })
        .then((data) => {
          expect(data).toEqual({ error: "Not found" });
          server.close();
          done();
        });
    });
  }, 5000);

  // Test chained response methods
  test("should handle chained response methods", (done) => {
    server = new Hasty();

    server.get("/chain", (req, res) => {
      res.status(201).json({ message: "Created" });
    });

    server.listen(3000, () => {
      fetch("http://localhost:3000/chain")
        .then((response) => {
          expect(response.status).toBe(201);
          return response.json();
        })
        .then((data) => {
          expect(data).toEqual({ message: "Created" });
          server.close();
          done();
        });
    });
  }, 5000);

  // Test different HTTP methods on same route
  test("should handle different HTTP methods on same route", (done) => {
    server = new Hasty();

    server.get("/multi-method", (req, res) => {
      res.send("GET response");
    });

    server.post("/multi-method", (req, res) => {
      res.send("POST response");
    });

    server.listen(3000, () => {
      Promise.all([
        fetch("http://localhost:3000/multi-method"),
        fetch("http://localhost:3000/multi-method", { method: "POST" }),
      ]).then(([getRes, postRes]) => {
        Promise.all([getRes.text(), postRes.text()]).then(
          ([getText, postText]) => {
            expect(getText).toBe("GET response");
            expect(postText).toBe("POST response");
            server.close();
            done();
          }
        );
      });
    });
  }, 10000);
});
