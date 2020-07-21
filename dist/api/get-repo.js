"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("../lib/utils/log"));
const get_remote_info_1 = __importDefault(require("../lib/github/get-remote-info"));
const config_1 = __importDefault(require("../lib/utils/config"));
const route_1 = __importDefault(require("../lib/utils/route"));
module.exports = route_1.default(async (req, res) => {
    log_1.default('[req:get-repo]', req.url);
    const query = Object.assign(Object.assign(Object.assign({}, req.cookies), req.query), req.params);
    res
        .assert(config_1.default.canAccess(query), 401, 'Restricted access')
        .assert(query.owner, 422, '`owner` must be passed in')
        .assert(query.repo, 422, '`repo` must be passed in');
    if (!new URL(req.url, 'http://a').pathname.endsWith('/')) {
        return res.redirect(301, `/${query.owner}/${query.repo}/`);
    }
    const { source, data } = await get_remote_info_1.default(query);
    res.headers({
        'X-GITHUB-CDN-SOURCE': source,
        'Cache-Control': `${query.token ? 'private' : 'public'}, max-age=60`,
    }).send(data);
});
