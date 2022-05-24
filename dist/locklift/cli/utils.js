"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = exports.flatDirTree = exports.initializeDirIfNotExist = exports.checkDirEmpty = void 0;
const fs_1 = __importDefault(require("fs"));
const directory_tree_1 = __importDefault(require("directory-tree"));
const child_process_1 = require("child_process");
const underscore_1 = __importDefault(require("underscore"));
const path_1 = require("path");
const ejs_1 = __importDefault(require("ejs"));
const tablemark_1 = __importDefault(require("tablemark"));
function checkDirEmpty(dir) {
    if (!fs_1.default.existsSync(dir)) {
        return dir;
    }
    return fs_1.default.readdirSync(dir).length === 0;
}
exports.checkDirEmpty = checkDirEmpty;
function initializeDirIfNotExist(dir) {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir);
    }
}
exports.initializeDirIfNotExist = initializeDirIfNotExist;
function flatDirTree(tree) {
    return tree.children.reduce((acc, current) => {
        if (current.children === undefined) {
            return [...acc, current];
        }
        const flatChild = flatDirTree(current);
        return [...acc, ...flatChild];
    }, []);
}
exports.flatDirTree = flatDirTree;
class Builder {
    constructor(config, options) {
        this.config = config;
        this.options = options;
        this.docRegex = /(?<doc>^{(\s|.)*?^})/gm;
        this.nameRegex = /======= (?<contract>.*) =======/g;
    }
    buildContracts() {
        const contractsTree = this.getContractsTree();
        this.log(`Found ${contractsTree.length} sources`);
        try {
            contractsTree.map(({ path }) => {
                this.log(`Building ${path}`);
                const [, contractFileName] = path.match(new RegExp('contracts/(.*).sol'));
                const nodeModules = require
                    .resolve('locklift/package.json')
                    .replace('locklift/package.json', '');
                const includePath = `--include-path ${nodeModules}`;
                const output = (0, child_process_1.execSync)(`cd ${this.options.build} && \
        ${this.config.compiler.path} ${!this.options.disableIncludePath ? includePath : ''} ./../${path}`);
                this.log(`Compiled ${path}`);
                if (output.toString() === '')
                    return;
                const contractNameNoFolderStructure = contractFileName.split('/')[contractFileName.split('/').length - 1];
                const lib = this.config.linker.lib
                    ? ` --lib ${this.config.linker.lib} `
                    : '';
                const tvmLinkerLog = (0, child_process_1.execSync)(`cd ${this.options.build} && ${this.config.linker.path} compile ${lib} "${contractNameNoFolderStructure}.code" -a "${contractNameNoFolderStructure}.abi.json"`);
                const [, tvcFile] = tvmLinkerLog
                    .toString()
                    .match(new RegExp('Saved contract to file (.*)'));
                (0, child_process_1.execSync)(`cd ${this.options.build} && base64 < ${tvcFile} > ${contractNameNoFolderStructure}.base64`);
                (0, child_process_1.execSync)(`cd ${this.options.build} && mv ${tvcFile} ${contractNameNoFolderStructure}.tvc`);
                this.log(`Linked ${path}`);
            });
        }
        catch (e) {
            return false;
        }
        return true;
    }
    buildDocs() {
        const contractsTree = this.getContractsTree();
        console.log(`Found ${contractsTree.length} sources`);
        let docs = [];
        try {
            contractsTree.map(({ path }) => {
                this.log(`Building ${path}`);
                const output = (0, child_process_1.execSync)(`cd ${this.options.build} && ${this.config.compiler.path} ./../${path} --${this.options.mode}`);
                this.log(`Compiled ${path}`);
                docs = [...docs, ...this.parseDocs(output.toString())];
            });
            docs = docs.reduce((acc, doc) => {
                if (acc.find(({ path, name }) => path === doc.path && name === doc.name)) {
                    return acc;
                }
                return [...acc, doc];
            }, []);
            docs = docs.sort((a, b) => (a.name < b.name ? -1 : 1));
            const render = ejs_1.default.render(fs_1.default
                .readFileSync((0, path_1.resolve)(__dirname, './../templates/index.ejs'))
                .toString(), {
                docs,
                tablemark: tablemark_1.default,
            }, {
                rmWhitespace: true,
            });
            fs_1.default.writeFileSync((0, path_1.resolve)(process.cwd(), this.options.docs, 'index.md'), render);
            this.log('Docs generated successfully!');
        }
        catch (e) {
            return false;
        }
        return true;
    }
    parseDocs(output) {
        const contracts = [...output.matchAll(this.nameRegex)]
            .map((m) => m.groups.contract)
            .map((c) => (0, path_1.resolve)(process.cwd(), this.options.build, c));
        const docs = [...output.matchAll(this.docRegex)].map((m) => JSON.parse(m.groups.doc));
        return underscore_1.default.zip(contracts, docs).reduce((acc, [contract, doc]) => {
            const [path, name] = contract.split(':');
            if (name.match(new RegExp(this.options.include)) !== null &&
                path.startsWith(`${process.cwd()}/${this.options.contracts}`)) {
                return [
                    ...acc,
                    {
                        path: path.replace(`${process.cwd()}/`, ''),
                        name,
                        doc,
                    },
                ];
            }
            return acc;
        }, []);
    }
    getContractsTree() {
        const contractsNestedTree = (0, directory_tree_1.default)(this.options.contracts, {
            extensions: /\.sol/,
        });
        return flatDirTree(contractsNestedTree);
    }
    log(text) {
        console.log(text);
    }
}
exports.Builder = Builder;
//# sourceMappingURL=utils.js.map