"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("../lib/utils/log"));
const github_api_1 = __importDefault(require("../lib/utils/github-api"));
const config_1 = require("../lib/utils/config");
const route_1 = __importDefault(require("../lib/utils/route"));
module.exports = route_1.default(async (req, res) => {
    log_1.default('[req:get-ratelimit]', req.url);
    const [token, source] = (() => {
        if ('token' in req.query) {
            return [req.query.token, 'query'];
        }
        if ('token' in req.cookies) {
            return [req.cookies.token, 'cookie'];
        }
        if (config_1.github.token) {
            return [config_1.github.token, 'server'];
        }
        return [undefined, 'n/a'];
    })();
    const opts = token ? { headers: { Authorization: `token ${token}` } } : undefined;
    const data = await github_api_1.default('rate_limit', opts).json();
    res.assert(!data.message, 500, data.message);
    res.send({
        token_source: source,
        rate: data.resources.core,
    });
});
