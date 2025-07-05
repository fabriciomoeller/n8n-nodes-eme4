"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.B24CryptoManager = void 0;
class B24CryptoManager {
    constructor() {
        this.description = {
            displayName: 'B24 Crypto Manager',
            icon: 'file:b24Logo.svg',
            name: 'b24CryptoManager',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["currency"]}}',
            description: 'Basic B24 Crypto Manager',
            defaults: {
                name: 'B24 Crypto Manager',
            },
            inputs: ["main"],
            outputs: ["main"],
            usableAsTool: true,
            requestDefaults: {
                baseURL: 'https://api.binance.com/api/v3',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
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
                            name: 'Coin',
                            value: 'coin',
                        }
                    ],
                    default: 'coin',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['coin'],
                        },
                    },
                    options: [
                        {
                            name: 'Get Symbol Price',
                            value: 'getSymbolPrice',
                            description: 'Get price for a specific symbol',
                            action: 'Get price for a specific symbol',
                            routing: {
                                request: {
                                    method: 'GET',
                                    url: '=/ticker/price?symbol={{$parameter["symbol"]}}',
                                },
                            },
                        },
                    ],
                    default: 'getSymbolPrice',
                },
                {
                    displayName: 'Symbol',
                    name: 'symbol',
                    type: 'string',
                    default: 'BTCUSDT',
                    description: 'The trading pair symbol (e.g., BTCUSDT, ETHUSDT)',
                    displayOptions: {
                        show: {
                            resource: ['coin'],
                        },
                    },
                },
            ],
        };
    }
}
exports.B24CryptoManager = B24CryptoManager;
//# sourceMappingURL=B24CryptoManager.node.js.map