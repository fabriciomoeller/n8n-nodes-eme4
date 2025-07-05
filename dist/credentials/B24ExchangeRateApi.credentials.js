"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.B24ExchangeRateApi = void 0;
class B24ExchangeRateApi {
    constructor() {
        this.name = 'b24ExchangeRateApi';
        this.displayName = 'B24 Exchange Rate API';
        this.documentationUrl = 'https://www.exchangerate-api.com/docs/overview';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'The API key for the Exchange Rate API',
            },
        ];
        this.test = {
            request: {
                baseURL: 'https://v6.exchangerate-api.com/v6',
                url: '/latest/EUR',
                method: 'GET',
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
    }
}
exports.B24ExchangeRateApi = B24ExchangeRateApi;
//# sourceMappingURL=B24ExchangeRateApi.credentials.js.map