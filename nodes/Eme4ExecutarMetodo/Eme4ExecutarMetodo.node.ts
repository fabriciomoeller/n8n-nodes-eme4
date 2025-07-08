import type {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  INodeExecutionData,
  IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class Eme4ExecutarMetodo implements INodeType {
  description: INodeTypeDescription = {
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
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'eme4ApiCredentialsApi',
        required: true,
      }
    ],
    usableAsTool: true,
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

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Obter credenciais
    const credentials = await this.getCredentials('eme4ApiCredentialsApi');
    
    // Primeiro, autenticar para obter o Session-Id
    const authOptions: IHttpRequestOptions = {
      method: 'GET',
      url: `${credentials.apiUrl}/autenticar`,
      headers: {
        'login': credentials.login as string,
        'password': credentials.password as string,
        'company': credentials.company as string,
      },
    };

    let sessionId: string;
    try {
      const authResponse = await this.helpers.httpRequest(authOptions);
      sessionId = authResponse.headers['session-id'] || authResponse.headers['Session-Id'];
      
      if (!sessionId) {
        throw new NodeOperationError(
          this.getNode(),
          'Session-Id não encontrado na resposta de autenticação'
        );
      }
    } catch (error) {
      throw new NodeOperationError(
        this.getNode(),
        `Erro na autenticação: ${error.message}`
      );
    }

    for (let i = 0; i < items.length; i++) {
      try {
        // Obter parâmetros
        const empresa = this.getNodeParameter('empresa', i) as string;
        const classe = this.getNodeParameter('classe', i) as string;
        const metodo = this.getNodeParameter('metodo', i) as string;
        const parametros = this.getNodeParameter('parametros', i) as any;
        const parametrosCustomizados = this.getNodeParameter('parametrosCustomizados', i) as string;

        // Processar parâmetros customizados
        let finalParams = { ...parametros };
        if (parametrosCustomizados && parametrosCustomizados.trim() !== '{}') {
          try {
            const customParams = JSON.parse(parametrosCustomizados);
            finalParams = { ...finalParams, ...customParams };
          } catch (error) {
            throw new NodeOperationError(
              this.getNode(),
              `Erro ao parsear parâmetros customizados: ${error.message}`,
              { itemIndex: i }
            );
          }
        }

        // Construir o payload
        const payload = {
          empresa,
          classe,
          metodo,
          parametros: finalParams,
        };

        // Configurar a requisição
        const options: IHttpRequestOptions = {
          method: 'POST',
          url: `${credentials.apiUrl}/ExecutarMetodo`,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Session-id': sessionId,
          },
          body: payload,
          json: true,
        };

        // Fazer a requisição
        const response = await this.helpers.httpRequest(options);

        // Adicionar o resultado
        returnData.push({
          json: response,
          pairedItem: { item: i },
        });

      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: error.message },
            pairedItem: { item: i },
          });
        } else {
          throw new NodeOperationError(
            this.getNode(),
            `Erro ao executar método: ${error.message}`,
            { itemIndex: i }
          );
        }
      }
    }

    return [returnData];
  }
}
