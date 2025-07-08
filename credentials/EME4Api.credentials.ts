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
      headers: {
        'Content-Type': 'application/json',
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

// Classe auxiliar para gerenciar cache de sessão
/*export class EME4SessionManager {
  private static sessions: Map<string, {
    sessionId: string;
    expiresAt: number;
    userId: string;
  }> = new Map();

  static async getValidSession(
    baseUrl: string,
    company: string,
    login: string,
    password: string,
    cacheMinutes: number = 8,
    httpRequest: any
  ): Promise<{
    sessionId: string;
    userId: string;
    fromCache: boolean;
  }> {
    const cacheKey = `${baseUrl}_${company}_${login}`;
    const now = Date.now();

    // Verificar se existe sessão válida no cache
    const cachedSession = this.sessions.get(cacheKey);
    if (cachedSession && now < cachedSession.expiresAt) {
      return {
        sessionId: cachedSession.sessionId,
        userId: cachedSession.userId,
        fromCache: true,
      };
    }

    // Fazer nova autenticação
    try {
      const response = await httpRequest({
        method: 'GET',
        url: `${baseUrl}/autenticar`,
        headers: {
          'company': company,
          'login': login,
          'password': password,
        },
        resolveWithFullResponse: true,
      });

      const sessionId = response.headers['session-id'];
      const userId = response.headers['idusuario'];

      if (!sessionId) {
        throw new Error('Session-Id não encontrado na resposta de autenticação');
      }

      // Armazenar no cache
      const expiresAt = now + (cacheMinutes * 60 * 1000);
      this.sessions.set(cacheKey, {
        sessionId,
        userId,
        expiresAt,
      });

      return {
        sessionId,
        userId,
        fromCache: false,
      };
    } catch (error) {
      throw new Error(`Erro na autenticação EME4: ${error.message}`);
    }
  }

  static clearCache(baseUrl?: string, company?: string, login?: string) {
    if (baseUrl && company && login) {
      const cacheKey = `${baseUrl}_${company}_${login}`;
      this.sessions.delete(cacheKey);
    } else {
      this.sessions.clear();
    }
  }

  static getCacheInfo() {
    const now = Date.now();
    const activeSessions = Array.from(this.sessions.entries()).map(([key, session]) => ({
      key,
      sessionId: session.sessionId,
      userId: session.userId,
      isValid: now < session.expiresAt,
      expiresIn: Math.max(0, session.expiresAt - now),
    }));

    return {
      totalSessions: this.sessions.size,
      activeSessions,
    };
  }
}*/
