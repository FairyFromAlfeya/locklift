export declare function checkDirEmpty(dir: any): any;
export declare function initializeDirIfNotExist(dir: any): void;
export declare function flatDirTree(tree: any): any;
export declare class Builder {
    private config;
    private options;
    docRegex: RegExp;
    nameRegex: RegExp;
    constructor(config: any, options: any);
    buildContracts(): boolean;
    buildDocs(): boolean;
    parseDocs(output: any): any;
    getContractsTree(): any;
    log(text: any): void;
}
