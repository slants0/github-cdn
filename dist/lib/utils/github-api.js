"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const got = require('got');
const { github } = require('./config');
const githubApi = got.extend({
    prefixUrl: github.apiBase,
    throwHttpErrors: false,
    timeout: 10000,
    headers: {
        Accept: 'application/vnd.github.v3.raw+json',
    },
});
exports.default = githubApi;
