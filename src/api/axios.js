// src/api/axios.ts - Convert to proper TypeScript
interface AuthResponse {
    status: number;
    data: any;
}

const config = {
    mode: "cors" as RequestMode,
    headers: { "Content-Type": "application/json" },
    credentials: 'same-origin' as RequestCredentials,
};

export const auth = {
    get: async (url: string): Promise<AuthResponse> => {
        const response = await fetch(`https://stateezer.com${url}`, {
            ...config,
            method: 'GET'
        });
        return {
            status: response.status,
            data: await response.json()
        };
    },
    post: async (url: string, data?: any): Promise<AuthResponse> => {
        const response = await fetch(`https://stateezer.com${url}`, {
            ...config,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined
        });
        return {
            status: response.status,
            data: await response.json()
        };
    }
};

export default auth;