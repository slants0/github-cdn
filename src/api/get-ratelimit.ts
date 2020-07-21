import log from '../lib/utils/log';
import githubApi from '../lib/utils/github-api';
import { github } from '../lib/utils/config';
import route from '../lib/utils/route';

export default route(async (req, res) => {
	log('[req:get-ratelimit]', req.url);

	const [token, source] = (() => {
		if ('token' in req.query) { return [req.query.token, 'query']; }
		if ('token' in req.cookies) { return [req.cookies.token, 'cookie']; }
		if (github.token) { return [github.token, 'server']; }
		return [undefined, 'n/a'];
	})();
	const opts = token ? { headers: { Authorization: `token ${token}` } } : undefined;
	const data = await githubApi('rate_limit', opts).json();

	res.assert(!data.message, 500, data.message);

	res.send({
		token_source: source,
		rate: data.resources.core,
	});
});
