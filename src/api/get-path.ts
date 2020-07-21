import mime from 'mime';
import log from '../lib/utils/log';
import resolveRef from '../lib/resolve-ref';
import badgenUrl from '../lib/badgen-url';
import getPath from '../lib/github/get-path';
import config from '../lib/utils/config';
import route from '../lib/utils/route';

const constructUrl = ({
	owner, repo, ref, badge, path = '',
}) => `/${owner}/${repo}/${ref}${path}${(badge === '') ? '?badge' : ''}`;

module.exports = route(async (req, res) => {
	log('[req:get-path]', req.url);

	const query = { ...req.cookies, ...req.query, ...req.params };

	res.assert(config.canAccess(query), 401, 'Restricted access');

	const resolved = await resolveRef(query);

	if (resolved.ref) {
		return res.redirect(302, constructUrl({ ...query, ...resolved }));
	}

	const cacheAge = (!resolved.ref && resolved.type === 'version') ? '31536000, immutable' : '60';
	res.setHeader('Cache-Control', `${query.token ? 'private' : 'public'}, max-age=${cacheAge}`);

	const { path } = query;

	if (!path) {
		return res.redirect(
			301,
			query.badge === '' ? badgenUrl(query) : constructUrl({ ...query, path: '/' }),
		);
	}

	const { source, data } = await getPath(query);
	res
		.headers({
			'X-GITHUB-CDN-SOURCE': source,
			'Content-type': mime.getType(path),
		})
		.send(data);
});
