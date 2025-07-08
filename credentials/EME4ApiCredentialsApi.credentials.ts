import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class EME4ApiCredentialsApi implements ICredentialType {
  name = 'eme4ApiCredentialsApi';
  displayName = 'EME4 API Credentials API';
  documentationUrl = 'https://docs.eme4.com/api';
  properties: INodeProperties[] = [
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

  // Implementação de autenticação customizada
  authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: { // Enviar como headers
				'login': '={{ $credentials.login }}',
				'password': '={{ $credentials.password }}',
				'company': '={{ $credentials.companyId }}',
			},
		},
	};

  // Teste da credencial
  test: ICredentialTestRequest = {
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
