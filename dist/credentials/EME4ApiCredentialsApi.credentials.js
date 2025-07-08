"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eme4ApiCredentialsApi = void 0;
class Eme4ApiCredentialsApi {
    constructor() {
        this.name = 'eme4ApiCredentialsApi';
        this.displayName = 'EME4 API Credentials API';
        this.documentationUrl = 'https://your-docs-url';
        this.properties = [
            {
                displayName: 'Login',
                name: 'login',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
            },
            {
                displayName: 'Company ID',
                name: 'companyId',
                type: 'string',
                default: '1',
            },
            {
                displayName: 'Session ID',
                name: 'sessionId',
                type: 'string',
                default: '',
                typeOptions: {
                    password: true,
                },
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'login': '={{ $credentials.login }}',
                    'password': '={{ $credentials.password }}',
                    'company': '={{ $credentials.companyId }}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'http://192.168.0.183:9295',
                url: '/autenticar',
                method: 'GET',
            },
        };
    }
}
exports.Eme4ApiCredentialsApi = Eme4ApiCredentialsApi;
//# sourceMappingURL=EME4ApiCredentialsApi.credentials.js.map