import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../types";

export class IPGet extends OpenAPIRoute {
    schema = {
        tags: ["IP"],
        summary: "Get client IP address",
        request: {
            headers: z.object({
                "user-agent": z.string().optional(),
            }),
        },
        responses: {
            "200": {
                description: "Returns the client's IP address",
                content: {
                    "text/plain": {
                        schema: z.string(),
                    },
                },
            },
        },
    };

    async handle(c: AppContext) {
        const userAgent = c.req.header("user-agent") || "";
        const isCurl = userAgent.toLowerCase().includes("curl");

        if (!isCurl) {
            // For non-curl requests, we'll redirect to the website (future feature)
            return new Response(null, {
                status: 302,
                headers: {
                    Location: "/",
                },
            });
        }

        // Get the client IP from Cloudflare's headers
        const clientIP = c.req.header("cf-connecting-ip") || 
                        c.req.header("x-forwarded-for") || 
                        c.req.header("x-real-ip") || 
                        "Unknown";

        return new Response(clientIP, {
            headers: {
                "content-type": "text/plain",
            },
        });
    }
} 