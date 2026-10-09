interface ApiRequest {
    method?: string;
    query?: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
    status(code: number): ApiResponse;
    setHeader(name: string, value: string): void;
    send(body: string): void;
}

declare const process: {
    env: Record<string, string | undefined>;
};

function getQueryValue(
    value: string | string[] | undefined,
): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

export default async function handler(
    req: ApiRequest,
    res: ApiResponse,
): Promise<void> {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        res.status(405).send("Método no permitido.");
        return;
    }

    const apiKey = process.env.REST_COUNTRIES_API_KEY?.trim();
    if (!apiKey) {
        res.status(500).send(
            "Falta configurar REST_COUNTRIES_API_KEY en las variables de entorno.",
        );
        return;
    }

    const params = new URLSearchParams();
    for (const name of ["limit", "offset", "pretty"] as const) {
        const value = getQueryValue(req.query?.[name]);
        if (value !== undefined) {
            params.set(name, value);
        }
    }

    try {
        const upstream = await fetch(
            `https://api.restcountries.com/v5?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    Accept: "application/json",
                },
            },
        );
        const body = await upstream.text();
        res.setHeader(
            "Content-Type",
            upstream.headers.get("content-type") ?? "application/json",
        );
        res.status(upstream.status).send(body);
    } catch (error: unknown) {
        const details = error instanceof Error ? `: ${error.message}` : "";
        res.status(502).send(
            `Error al conectar con el servicio de países${details}`,
        );
    }
}
