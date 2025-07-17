// Script simple para probar el backend
const http = require("http");

const baseURL = "http://localhost:3001";

// Función para hacer requests
const makeRequest = (path, method = "GET", data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3001,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
          });
        }
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

// Tests
async function runTests() {
  console.log("🧪 Iniciando tests del backend...\n");

  try {
    // Test 1: Health check
    console.log("1. Testing health check...");
    const health = await makeRequest("/health");
    console.log(`   Status: ${health.status}`);
    console.log(`   Response: ${JSON.stringify(health.data, null, 2)}\n`);

    // Test 2: API info
    console.log("2. Testing API info...");
    const apiInfo = await makeRequest("/api");
    console.log(`   Status: ${apiInfo.status}`);
    console.log(`   API: ${apiInfo.data.message}\n`);

    // Test 3: Get accommodations
    console.log("3. Testing accommodations endpoint...");
    const accommodations = await makeRequest("/api/accommodations");
    console.log(`   Status: ${accommodations.status}`);
    console.log(
      `   Total accommodations: ${accommodations.data.data?.accommodations?.length || 0}\n`,
    );

    // Test 4: Get accommodations by location
    console.log("4. Testing accommodations by location...");
    const elSunzal = await makeRequest(
      "/api/accommodations/location/el-sunzal",
    );
    console.log(`   Status: ${elSunzal.status}`);
    console.log(
      `   El Sunzal accommodations: ${elSunzal.data.data?.accommodations?.length || 0}\n`,
    );

    // Test 5: Search availability
    console.log("5. Testing availability search...");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const checkIn = tomorrow.toISOString().split("T")[0];
    const checkOut = dayAfter.toISOString().split("T")[0];

    const availability = await makeRequest(
      `/api/accommodations/search/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=2`,
    );
    console.log(`   Status: ${availability.status}`);
    console.log(
      `   Available accommodations: ${availability.data.data?.availableAccommodations?.length || 0}\n`,
    );

    // Test 6: Try login (should fail without credentials)
    console.log("6. Testing login endpoint (without credentials)...");
    const login = await makeRequest("/api/auth/login", "POST", {});
    console.log(`   Status: ${login.status}`);
    console.log(`   Expected error: ${login.data.error}\n`);

    // Test 7: Try login with demo credentials
    console.log("7. Testing login with demo credentials...");
    const demoLogin = await makeRequest("/api/auth/login", "POST", {
      username: "demo",
      password: "demo123",
    });
    console.log(`   Status: ${demoLogin.status}`);
    if (demoLogin.data.success) {
      console.log(`   Login successful: ${demoLogin.data.data.user.fullName}`);
      console.log(
        `   Token received: ${demoLogin.data.data.token ? "Yes" : "No"}\n`,
      );
    } else {
      console.log(`   Login failed: ${demoLogin.data.error}\n`);
    }

    console.log("✅ Tests completados!");
  } catch (error) {
    console.error("❌ Error en los tests:", error.message);
  }
}

// Esperar un poco para que el servidor esté listo
setTimeout(runTests, 2000);
