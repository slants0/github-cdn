"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mime_1 = __importDefault(require("mime"));
const log_1 = __importDefault(require("../lib/utils/log"));
const route_1 = __importDefault(require("../lib/utils/route"));
const get_gist_1 = __importDefault(require("../lib/github/get-gist"));
module.exports = route_1.default(async (req, res) => {
    log_1.default('[req:get-gist]', req.url);
    const query = Object.assign(Object.assign(Object.assign({}, req.cookies), req.query), req.params);
    res.assert(query.gistId, 422, '`gistId` must be passed in');
    const { source, data } = await get_gist_1.default(query);
    res
        .headers({
        'X-GITHUB-CDN-SOURCE': source,
        'Content-type': mime_1.default.getType(query.path),
    })
        .send(data);
});
