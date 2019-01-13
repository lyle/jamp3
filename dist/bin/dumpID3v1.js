"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const utils_1 = require("../lib/common/utils");
const commander_1 = __importDefault(require("commander"));
const pack = require('../../package.json');
const fs_extra_1 = __importDefault(require("fs-extra"));
commander_1.default
    .version(pack.version, '-v, --version')
    .usage('[options]')
    .option('-i, --input <fileOrDir>', 'mp3 file or folder')
    .option('-r, --recursive', 'dump the folder recursive')
    .option('-d, --dest <file>', 'destination analyze result file')
    .parse(process.argv);
const id3v1 = new __1.ID3v1();
const result = [];
function onFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const tag = yield id3v1.read(filename);
        let dump;
        if (tag) {
            dump = { filename, tag: tag };
        }
        else {
            dump = { error: 'No tag found', filename };
        }
        if (commander_1.default.dest) {
            result.push(dump);
        }
        else {
            console.log(JSON.stringify(dump, null, '\t'));
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let input = commander_1.default.input;
        if (!input) {
            if (commander_1.default.args[0]) {
                input = commander_1.default.args[0];
            }
        }
        if (!input || input.length === 0) {
            return Promise.reject(Error('must specify a filename/directory'));
        }
        const stat = yield fs_extra_1.default.stat(input);
        if (stat.isDirectory()) {
            yield utils_1.collectFiles(input, ['.mp3'], commander_1.default.recursive, onFile);
        }
        else {
            yield onFile(input);
        }
        if (commander_1.default.dest) {
            yield fs_extra_1.default.writeJSON(commander_1.default.dest, result);
        }
    });
}
run().catch(e => {
    console.error(e);
});
//# sourceMappingURL=dumpID3v1.js.map