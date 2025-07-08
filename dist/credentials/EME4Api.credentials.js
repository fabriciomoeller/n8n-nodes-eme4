"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EME4ApiCredentialsApi = void 0;
class EME4ApiCredentialsApi {
    constructor() {
        this.name = 'eme4ApiCredentialsApi';
        this.displayName = 'EME4 API Credentials API';
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
exports.EME4ApiCredentialsApi = EME4ApiCredentialsApi;
//# sourceMappingURL=EME4Api.credentials.js.map