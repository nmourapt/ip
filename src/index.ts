import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";
import { IPGet } from "./endpoints/ip";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
openapi.get("/api/tasks", TaskList);
openapi.post("/api/tasks", TaskCreate);
openapi.get("/api/tasks/:taskSlug", TaskFetch);
openapi.delete("/api/tasks/:taskSlug", TaskDelete);
openapi.get("/api/v1/ip", IPGet);

// Catch-all route for the root path
app.get("/", (c) => {
    const userAgent = c.req.header("user-agent") || "";
    const isCurl = userAgent.toLowerCase().includes("curl");

    if (isCurl) {
        // For curl requests, redirect to the IP endpoint
        return c.redirect("/api/v1/ip");
    }

    // For non-curl requests, return a simple HTML page (future feature)
    return c.html(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>IP Lookup Service</title>
            </head>
            <body>
                <h1>Welcome to IP Lookup Service</h1>
                <p>This service will show your IP address and geolocation information.</p>
                <p>For API access, use: <code>curl ip.nmoura.pt</code></p>
            </body>
        </html>
    `);
});

// Export the Hono app
export default app;
