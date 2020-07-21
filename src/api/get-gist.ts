import mime from 'mime';
import log from '../lib/utils/log';
import route from '../lib/utils/route';
import getGist from '../lib/github/get-gist';

export default route(async (req, res) => {
	log('[req:get-gist]', req.url);

	const query = { ...req.cookies, ...req.query, ...req.params };

	res.assert(query.gistId, 422, '`gistId` must be passed in');

	const { source, data } = await getGist(query);

	res
		.headers({
			'X-GITHUB-CDN-SOURCE': source,
			'Content-type': mime.getType(query.path),
		})
		.send(data);
});
