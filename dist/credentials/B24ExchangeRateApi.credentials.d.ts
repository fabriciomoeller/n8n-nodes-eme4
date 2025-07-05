import { ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class B24ExchangeRateApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    properties: INodeProperties[];
    test: ICredentialTestRequest;
}
