"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EME4ApiCredentialsApi = void 0;
class EME4ApiCredentialsApi {
    constructor() {
        this.name = 'eme4ApiCredentialsApi';
        this.displayName = 'EME4 API Credentials API';
        this.documentationUrl = 'https://your-docs-url.com';
        this.properties = [
            {
                displayName: 'API URL',
                name: 'apiUrl',
                type: 'string',
                default: 'http://192.168.0.183:9295',
                required: true,
                description: 'URL base da API EME4',
            },
            {
                displayName: 'Login',
                name: 'login',
                type: 'string',
                default: '',
                required: true,
                description: 'Login do usuário',
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
                description: 'Senha do usuário',
            },
            {
                displayName: 'Company',
                name: 'company',
                type: 'string',
                default: '1',
                required: true,
                description: 'ID da empresa',
            },
        ];
        this.test = {
            request: {
                baseURL: '={{$credentials.apiUrl}}',
                url: '/autenticar',
                method: 'GET',
                headers: {
                    login: '={{$credentials.login}}',
                    password: '={{$credentials.password}}',
                    company: '={{$credentials.company}}',
                },
            },
        };
    }
}
exports.EME4ApiCredentialsApi = EME4ApiCredentialsApi;
//# sourceMappingURL=EME4ApiCredentialsApi.credentials.js.map