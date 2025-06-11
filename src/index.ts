import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";
import { IPGet } from "./endpoints/ip";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Handle root path first
app.get("/", (c) => {
    const userAgent = c.req.header("user-agent") || "";
    const isCurl = userAgent.toLowerCase().includes("curl");

    if (isCurl) {
        // For curl requests, redirect to the IP endpoint
        return c.redirect("/api/v1/ip");
    }

    // For non-curl requests, return a simple HTML page
    return c.html(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>IP Lookup Service</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        line-height: 1.6;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 2rem;
                        color: #333;
                    }
                    h1 {
                        color: #2c3e50;
                        border-bottom: 2px solid #eee;
                        padding-bottom: 0.5rem;
                    }
                    code {
                        background: #f8f9fa;
                        padding: 0.2rem 0.4rem;
                        border-radius: 3px;
                        font-family: monospace;
                    }
                </style>
            </head>
            <body>
                <h1>Welcome to IP Lookup Service</h1>
                <p>This service provides IP address and geolocation information.</p>
                <h2>API Usage</h2>
                <p>To get your IP address, use:</p>
                <pre><code>curl ip.nmoura.pt</code></pre>
                <p>Or access the API endpoint directly:</p>
                <pre><code>curl ip.nmoura.pt/api/v1/ip</code></pre>
                <p>For API documentation, visit: <a href="/docs">API Documentation</a></p>
            </body>
        </html>
    `);
});

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/docs",
});

// Register OpenAPI endpoints
openapi.get("/api/tasks", TaskList);
openapi.post("/api/tasks", TaskCreate);
openapi.get("/api/tasks/:taskSlug", TaskFetch);
openapi.delete("/api/tasks/:taskSlug", TaskDelete);
openapi.get("/api/v1/ip", IPGet);

// Export the Hono app
export default app;
