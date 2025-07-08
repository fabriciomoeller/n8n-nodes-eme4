"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eme4ExecutarMetodo = void 0;
class Eme4ExecutarMetodo {
    constructor() {
        this.description = {
            displayName: 'EME4 API Executar Método',
            icon: 'file:LOGO_EME4_2022-01.svg',
            name: 'eme4ExecutarMetodo',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["classe"] + "." + $parameter["metodo"]}}',
            description: 'EME4 API Executar Método',
            defaults: {
                name: 'EME4 API Executar Método',
            },
            inputs: ["main"],
            outputs: ["main"],
            credentials: [
                {
                    name: 'eme4ApiCredentialsApi',
                    required: true,
                }
            ],
            usableAsTool: true,
            requestDefaults: {
                baseURL: 'http://192.168.0.183:9295/ExecutarMetodo',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Session-id': '{{$credentials.apiKey}}'
                },
            },
            properties: [
                {
                    displayName: 'Empresa',
                    name: 'empresa',
                    type: 'string',
                    required: true,
                    default: '1',
                    description: 'ID da empresa',
                },
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
                            displayName: 'Data Emissão',
                            name: 'data_emissao',
                            type: 'string',
                            default: '2025-04-01',
                            placeholder: 'YYYY-MM-DD',
                            description: 'Data de emissão do contrato',
                        },
                        {
                            displayName: 'ID Cliente',
                            name: 'id_cliente',
                            type: 'number',
                            default: 17956,
                            description: 'ID do cliente',
                        },
                        {
                            displayName: 'ID Filial',
                            name: 'id_filial',
                            type: 'number',
                            default: 271,
                            description: 'ID da filial',
                        },
                        {
                            displayName: 'ID Modalidade Contrato',
                            name: 'id_modalidade_contrato',
                            type: 'number',
                            default: 1,
                            description: 'ID da modalidade do contrato',
                        },
                        {
                            displayName: 'ID Tipo Documento',
                            name: 'id_tipo_documento',
                            type: 'number',
                            default: 184,
                            description: 'ID do tipo de documento',
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
                            displayName: 'Início Geração Pedidos',
                            name: 'inicio_geracao_pedidos',
                            type: 'string',
                            default: '2025-04-01',
                            placeholder: 'YYYY-MM-DD',
                            description: 'Data de início da geração de pedidos',
                        },
                        {
                            displayName: 'Número Contrato Digitado',
                            name: 'numero_contrato_digitado',
                            type: 'string',
                            default: 'CONTRATO-2025-04_01',
                            description: 'Número do contrato digitado',
                        },
                        {
                            displayName: 'Periodicidade',
                            name: 'periodicidade',
                            type: 'string',
                            default: '2',
                            description: 'Periodicidade do contrato',
                        },
                        {
                            displayName: 'Validade Contrato',
                            name: 'validade_contrato',
                            type: 'string',
                            default: '2999-12-31',
                            placeholder: 'YYYY-MM-DD',
                            description: 'Data de validade do contrato',
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
}
exports.Eme4ExecutarMetodo = Eme4ExecutarMetodo;
//# sourceMappingURL=Eme4ExecutarMetodo.node.js.map