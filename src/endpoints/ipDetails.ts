import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../types";

export class IPDetails extends OpenAPIRoute {
    schema = {
        tags: ["IP"],
        summary: "Get detailed IP information",
        request: {
            headers: z.object({
                "user-agent": z.string().optional(),
            }),
        },
        responses: {
            "200": {
                description: "Returns detailed IP information",
                content: {
                    "application/json": {
                        schema: z.object({
                            ip: z.string(),
                            city: z.string().nullable(),
                            country: z.string().nullable(),
                            continent: z.string().nullable(),
                            region: z.string().nullable(),
                            postal_code: z.string().nullable(),
                            latitude: z.string().nullable(),
                            longitude: z.string().nullable(),
                        }),
                    },
                },
            },
        },
    };

    async handle(c: AppContext) {
        const userAgent = c.req.header("user-agent") || "";
        const isCurl = userAgent.toLowerCase().includes("curl");

        if (!isCurl) {
            return new Response("Forbidden - Only curl requests are allowed", {
                status: 403,
                headers: {
                    "content-type": "text/plain",
                },
            });
        }

        // Get the client IP and enriched data from Cloudflare headers
        const clientIP = c.req.header("cf-connecting-ip") || 
                        c.req.header("x-forwarded-for") || 
                        c.req.header("x-real-ip") || 
                        "Unknown";

        return {
            ip: clientIP,
            city: c.req.header("cf-ipcity") || null,
            country: c.req.header("cf-ipcountry") || null,
            continent: c.req.header("cf-ipcontinent") || null,
            region: c.req.header("cf-region") || null,
            postal_code: c.req.header("cf-postal-code") || null,
            latitude: c.req.header("cf-iplatitude") || null,
            longitude: c.req.header("cf-iplongitude") || null,
        };
    }
} 