"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EME4ApiExecutarMetodo = void 0;
class EME4ApiExecutarMetodo {
    constructor() {
        this.description = {
            displayName: 'EME4 API Executar Método',
            icon: 'file:LOGO_EME4_2022-01.svg',
            name: 'eme4ApiExecutarMetodo',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["classe"] + "." + $parameter["metodo"]}}',
            description: 'EME4 API Executar Método',
            defaults: {
                name: 'EME4 API Executar Método',
            },
            inputs: ["main"],
            outputs: ["main"],
            usableAsTool: true,
            credentials: [
                {
                    name: 'eme4ApiCredentials',
                    required: true,
                },
            ],
            requestDefaults: {
                baseURL: '={{$credentials.baseUrl}}/ExecutarMetodo',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            },
            properties: [
                {
                    displayName: 'Classe',
                    name: 'classe',
                    type: 'string',
                    required: true,
                    default: 'DocumentoContratoVenda',
                    description: 'Nome da classe a ser executada',
                },
                {
                    displayName: 'Método',
                    name: 'metodo',
                    type: 'options',
                    required: true,
                    default: 'IncluirPorAPI',
                    description: 'Nome do método a ser executado',
                    options: [
                        {
                            name: 'Incluir Por API',
                            value: 'IncluirPorAPI',
                        },
                        {
                            name: 'Alterar Por API',
                            value: 'AlterarPorAPI',
                        },
                    ],
                },
                {
                    displayName: 'Parâmetros',
                    name: 'parametros',
                    type: 'collection',
                    placeholder: 'Adicionar Parâmetro',
                    default: {},
                    description: 'Parâmetros específicos para o método',
                    options: [
                        {
                            displayName: 'ID Tipo Documento',
                            name: 'id_tipo_documento',
                            type: 'number',
                            default: 184,
                            description: 'ID do tipo de documento',
                        },
                        {
                            displayName: 'ID Filial',
                            name: 'id_filial',
                            type: 'number',
                            default: 271,
                            description: 'ID da filial',
                        },
                        {
                            displayName: 'ID Cliente',
                            name: 'id_cliente',
                            type: 'number',
                            default: 17956,
                            description: 'ID do cliente',
                        },
                        {
                            displayName: 'ID Modalidade Contrato',
                            name: 'id_modalidade_contrato',
                            type: 'number',
                            default: 1,
                            description: 'ID da modalidade do contrato',
                        },
                        {
                            displayName: 'Data Emissão',
                            name: 'data_emissao',
                            type: 'string',
                            default: '2025-04-01',
                            placeholder: 'YYYY-MM-DD',
                            description: 'Data de emissão do contrato',
                        },
                        {
                            displayName: 'Início Geração Pedidos',
                            name: 'inicio_geracao_pedidos',
                            type: 'string',
                            default: '2025-04-01',
                            placeholder: 'YYYY-MM-DD',
                            description: 'Data de início da geração de pedidos',
                        },
                        {
                            displayName: 'Periodicidade',
                            name: 'periodicidade',
                            type: 'string',
                            default: '2',
                            description: 'Periodicidade do contrato',
                        },
                        {
                            displayName: 'Início Contrato',
                            name: 'inicio_contrato',
                            type: 'string',
                            default: '2025-04-01',
                            placeholder: 'YYYY-MM-DD',
                            description: 'Data de início do contrato',
                        },
                        {
                            displayName: 'Validade Contrato',
                            name: 'validade_contrato',
                            type: 'string',
                            default: '2999-12-31',
                            placeholder: 'YYYY-MM-DD',
                            description: 'Data de validade do contrato',
                        },
                        {
                            displayName: 'Número Contrato Digitado',
                            name: 'numero_contrato_digitado',
                            type: 'string',
                            default: 'CONTRATO-2025-04_01',
                            description: 'Número do contrato digitado',
                        },
                    ],
                },
                {
                    displayName: 'Parâmetros Customizados (JSON)',
                    name: 'parametrosCustomizados',
                    type: 'json',
                    default: '{}',
                    description: 'Parâmetros customizados em formato JSON. Sobrescreve os parâmetros da collection acima.',
                },
            ],
        };
    }
    static async getValidSession(credentials, httpRequest) {
        const cacheKey = `${credentials.baseUrl}_${credentials.company}_${credentials.login}`;
        const now = Date.now();
        const cacheMinutes = credentials.cacheMinutes || 8;
        const cached = EME4ApiExecutarMetodo.sessionCache.get(cacheKey);
        if (cached && now < cached.expiresAt) {
            return {
                sessionId: cached.sessionId,
                userId: cached.userId,
                fromCache: true,
            };
        }
        try {
            const response = await httpRequest({
                method: 'GET',
                url: `${credentials.baseUrl}/autenticar`,
                headers: {
                    'company': credentials.company,
                    'login': credentials.login,
                    'password': credentials.password,
                },
                resolveWithFullResponse: true,
            });
            const sessionId = response.headers['session-id'];
            const userId = response.headers['idusuario'];
            if (!sessionId) {
                throw new Error('Session-Id não encontrado na resposta de autenticação');
            }
            const expiresAt = now + (cacheMinutes * 60 * 1000);
            EME4ApiExecutarMetodo.sessionCache.set(cacheKey, {
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
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('eme4ApiCredentials');
        for (let i = 0; i < items.length; i++) {
            try {
                const classe = this.getNodeParameter('classe', i);
                const metodo = this.getNodeParameter('metodo', i);
                const parametros = this.getNodeParameter('parametros', i);
                const parametrosCustomizados = this.getNodeParameter('parametrosCustomizados', i);
                const sessionInfo = await EME4ApiExecutarMetodo.getValidSession(credentials, this.helpers.request);
                let finalParametros = {};
                if (parametrosCustomizados && parametrosCustomizados.trim() !== '{}') {
                    try {
                        finalParametros = JSON.parse(parametrosCustomizados);
                    }
                    catch (error) {
                        throw new Error(`Erro ao parsear parâmetros customizados: ${error.message}`);
                    }
                }
                else {
                    finalParametros = Object.keys(parametros).reduce((acc, key) => {
                        if (parametros[key] !== undefined && parametros[key] !== null && parametros[key] !== '') {
                            acc[key] = parametros[key];
                        }
                        return acc;
                    }, {});
                }
                const body = {
                    empresa: credentials.company,
                    tipoExecucao: 'EXECUTARMETODO',
                    classe,
                    metodo,
                    parametros: [finalParametros],
                };
                const headers = {
                    'Content-Type': 'application/json',
                    'Session-id': sessionInfo.sessionId,
                };
                const response = await this.helpers.request({
                    method: 'POST',
                    url: `${credentials.baseUrl}/ExecutarMetodo`,
                    headers,
                    body,
                    json: true,
                });
                returnData.push({
                    json: {
                        success: true,
                        response,
                        requestBody: body,
                        sessionInfo: {
                            sessionId: sessionInfo.sessionId,
                            userId: sessionInfo.userId,
                            fromCache: sessionInfo.fromCache,
                        },
                    },
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            success: false,
                            error: error.message,
                        },
                    });
                }
                else {
                    throw error;
                }
            }
        }
        return [returnData];
    }
}
exports.EME4ApiExecutarMetodo = EME4ApiExecutarMetodo;
EME4ApiExecutarMetodo.sessionCache = new Map();
//# sourceMappingURL=EME4ApiExecutarMetodo.node.js.map