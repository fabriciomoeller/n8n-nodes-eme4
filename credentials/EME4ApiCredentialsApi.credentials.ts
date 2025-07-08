import type {
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class EME4ApiCredentialsApi implements ICredentialType {
  name = 'eme4ApiCredentialsApi';
  
  displayName = 'EME4 API Credentials API';
  
  documentationUrl = 'https://your-docs-url.com';
  
  properties: INodeProperties[] = [
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

  test: ICredentialTestRequest = {
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
