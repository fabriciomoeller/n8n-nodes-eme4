import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class EME4ApiExecutarMetodo implements INodeType {
    description: INodeTypeDescription;
    private static sessionCache;
    private static getValidSession;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
