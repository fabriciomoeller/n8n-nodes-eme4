import { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class EME4ApiCredentials implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
export declare class EME4SessionManager {
    private static sessions;
    static getValidSession(baseUrl: string, company: string, login: string, password: string, cacheMinutes: number | undefined, httpRequest: any): Promise<{
        sessionId: string;
        userId: string;
        fromCache: boolean;
    }>;
    static clearCache(baseUrl?: string, company?: string, login?: string): void;
    static getCacheInfo(): {
        totalSessions: number;
        activeSessions: {
            key: string;
            sessionId: string;
            userId: string;
            isValid: boolean;
            expiresIn: number;
        }[];
    };
}
