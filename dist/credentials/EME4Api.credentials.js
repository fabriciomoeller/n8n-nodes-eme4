"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EME4SessionManager = exports.EME4ApiCredentials = void 0;
class EME4ApiCredentials {
    constructor() {
        this.name = 'eme4ApiCredentials';
        this.displayName = 'EME4 API Credentials';
        this.documentationUrl = 'https://docs.eme4.com/api';
        this.properties = [
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'http://192.168.0.183:9295',
                required: true,
                description: 'URL base da API EME4',
            },
            {
                displayName: 'Company',
                name: 'company',
                type: 'string',
                default: '1',
                required: true,
                description: 'ID da empresa',
            },
            {
                displayName: 'Login',
                name: 'login',
                type: 'string',
                default: '',
                required: true,
                description: 'Nome de usuário para autenticação',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'Senha para autenticação',
            },
            {
                displayName: 'Session Cache Duration (minutes)',
                name: 'cacheMinutes',
                type: 'number',
                default: 8,
                required: false,
                description: 'Duração do cache da sessão em minutos (padrão: 8 minutos para SessionTimeout de 10 minutos)',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{ $credentials.baseUrl }}',
                url: '/autenticar',
                method: 'GET',
                headers: {
                    'company': '={{ $credentials.company }}',
                    'login': '={{ $credentials.login }}',
                    'password': '={{ $credentials.password }}',
                },
            },
        };
    }
}
exports.EME4ApiCredentials = EME4ApiCredentials;
class EME4SessionManager {
    static async getValidSession(baseUrl, company, login, password, cacheMinutes = 8, httpRequest) {
        const cacheKey = `${baseUrl}_${company}_${login}`;
        const now = Date.now();
        const cachedSession = this.sessions.get(cacheKey);
        if (cachedSession && now < cachedSession.expiresAt) {
            return {
                sessionId: cachedSession.sessionId,
                userId: cachedSession.userId,
                fromCache: true,
            };
        }
        try {
            const response = await httpRequest({
                method: 'GET',
                url: `${baseUrl}/autenticar`,
                headers: {
                    'company': company,
                    'login': login,
                    'password': password,
                },
                resolveWithFullResponse: true,
            });
            const sessionId = response.headers['session-id'];
            const userId = response.headers['idusuario'];
            if (!sessionId) {
                throw new Error('Session-Id não encontrado na resposta de autenticação');
            }
            const expiresAt = now + (cacheMinutes * 60 * 1000);
            this.sessions.set(cacheKey, {
                sessionId,
                userId,
                expiresAt,
            });
            return {
                sessionId,
                userId,
                fromCache: false,
            };
        }
        catch (error) {
            throw new Error(`Erro na autenticação EME4: ${error.message}`);
        }
    }
    static clearCache(baseUrl, company, login) {
        if (baseUrl && company && login) {
            const cacheKey = `${baseUrl}_${company}_${login}`;
            this.sessions.delete(cacheKey);
        }
        else {
            this.sessions.clear();
        }
    }
    static getCacheInfo() {
        const now = Date.now();
        const activeSessions = Array.from(this.sessions.entries()).map(([key, session]) => ({
            key,
            sessionId: session.sessionId,
            userId: session.userId,
            isValid: now < session.expiresAt,
            expiresIn: Math.max(0, session.expiresAt - now),
        }));
        return {
            totalSessions: this.sessions.size,
            activeSessions,
        };
    }
}
exports.EME4SessionManager = EME4SessionManager;
EME4SessionManager.sessions = new Map();
//# sourceMappingURL=EME4Api.credentials.js.map