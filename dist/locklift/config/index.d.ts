export declare function loadConfig(configPath: any): Promise<{
    compiler: {
        path: string;
    };
    linker: {
        path: string;
        lib?: any;
    };
    networks: Record<string, {
        keys: {
            path: string;
            phrase: string;
            amount: number;
        };
        giver: {
            address: string;
            abi: Record<string, unknown>;
            key: string;
        };
        ton_client?: any;
    }>;
}>;
