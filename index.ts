import { Router } from 'express';
import serveLanding from './api/serve-landing';
import getRatelimit from './api/get-ratelimit';
import getRepo from './api/get-repo';
import getPath from './api/get-path';
import getGist from './api/get-gist';

function githubCdnRouter() {
	const router = Router();

	router.get('/', serveLanding);

	router.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		next();
	});

	router.get('/ratelimit', getRatelimit);
	router.get('/gist/:gistId?/:path?', getGist);
	router.get('/:owner/:repo?', getRepo);
	router.get('/:owner/:repo/:ref?:path(/*)?', getPath);

	return router;
}

module.exports = githubCdnRouter;
