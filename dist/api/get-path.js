"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mime_1 = __importDefault(require("mime"));
const log_1 = __importDefault(require("../lib/utils/log"));
const resolve_ref_1 = __importDefault(require("../lib/resolve-ref"));
const badgen_url_1 = __importDefault(require("../lib/badgen-url"));
const get_path_1 = __importDefault(require("../lib/github/get-path"));
const config_1 = __importDefault(require("../lib/utils/config"));
const route_1 = __importDefault(require("../lib/utils/route"));
const constructUrl = ({ owner, repo, ref, badge, path = '', }) => `/${owner}/${repo}/${ref}${path}${(badge === '') ? '?badge' : ''}`;
module.exports = route_1.default(async (req, res) => {
    log_1.default('[req:get-path]', req.url);
    const query = Object.assign(Object.assign(Object.assign({}, req.cookies), req.query), req.params);
    res.assert(config_1.default.canAccess(query), 401, 'Restricted access');
    const resolved = await resolve_ref_1.default(query);
    if (resolved.ref) {
        return res.redirect(302, constructUrl(Object.assign(Object.assign({}, query), resolved)));
    }
    const cacheAge = (!resolved.ref && resolved.type === 'version') ? '31536000, immutable' : '60';
    res.setHeader('Cache-Control', `${query.token ? 'private' : 'public'}, max-age=${cacheAge}`);
    const { path } = query;
    if (!path) {
        return res.redirect(301, query.badge === '' ? badgen_url_1.default(query) : constructUrl(Object.assign(Object.assign({}, query), { path: '/' })));
    }
    const { source, data } = await get_path_1.default(query);
    res
        .headers({
        'X-GITHUB-CDN-SOURCE': source,
        'Content-type': mime_1.default.getType(path),
    })
        .send(data);
});
