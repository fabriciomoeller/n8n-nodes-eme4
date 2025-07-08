import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class Eme4ApiCredentialsApi implements ICredentialType {
	name = 'eme4ApiCredentialsApi';
	displayName = 'EME4 API Credentials API';
	documentationUrl = 'https://your-docs-url';

	properties: INodeProperties[] = [
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
            // Esta propriedade será preenchida dinamicamente
            // ou usada para testes, mas não é diretamente
            // preenchida pelo usuário na interface.
        },
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'login': '={{ $credentials.login }}',
				'password': '={{ $credentials.password }}',
				'company': '={{ $credentials.companyId }}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'http://192.168.0.183:9295',
			url: '/autenticar',
            method: 'GET',
            // O teste da credencial deve ser capaz de simular a autenticação
            // e verificar se um Session-Id é retornado.
            // Para um teste mais robusto, você pode precisar de um nó de teste
            // que realmente faça a requisição e verifique a resposta.
		},
	};
}
