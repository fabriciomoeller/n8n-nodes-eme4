"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.B24ExchangeRate = void 0;
class B24ExchangeRate {
    constructor() {
        this.description = {
            displayName: 'B24 Exchange Rate',
            name: 'b24ExchangeRate',
            icon: 'file:b24Logo.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["currency"]}}',
            description: 'Basic B24 Exchange Rate',
            defaults: {
                name: 'B24 Exchange Rate',
            },
            inputs: ["main"],
            outputs: ["main"],
            credentials: [
                {
                    name: 'b24ExchangeRateApi',
                    required: true,
                },
            ],
            usableAsTool: true,
            requestDefaults: {
                baseURL: 'https://v6.exchangerate-api.com/v6',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Rate',
                            value: 'rate',
                        }
                    ],
                    default: 'rate',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['rate'],
                        },
                    },
                    options: [
                        {
                            name: 'Get Exchange Rate',
                            value: 'getExchangeRate',
                            description: 'Get the exchange rate',
                            action: 'Get exchange rate',
                            routing: {
                                request: {
                                    method: 'GET',
                                    url: '=/latest/{{$parameter["currency"]}}',
                                },
                            },
                        },
                    ],
                    default: 'getExchangeRate',
                },
                {
                    displayName: 'Currency',
                    name: 'currency',
                    type: 'string',
                    default: 'USD',
                    description: 'The trading pair currency (e.g., EUR, GBP, AED, etc.)',
                    displayOptions: {
                        show: {
                            resource: ['rate'],
                        },
                    },
                },
            ],
        };
    }
}
exports.B24ExchangeRate = B24ExchangeRate;
//# sourceMappingURL=B24ExchangeRate.node.js.map