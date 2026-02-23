const axios = require('axios');
const cheerio = require('cheerio');

function wikimedia(title) {
	return new Promise((resolve, reject) => {
		axios.get(`https://commons.wikimedia.org/w/index.php?search=${title}&title=Special:MediaSearch&go=Go&type=image`)
		.then(({ data }) => {
			const $ = cheerio.load(data);
			const hasil = [];
			$('.sdms-search-results__list-wrapper > div > a').each((i, elem) => {
				hasil.push({
					title: $(elem).find('img').attr('alt'),
					source: $(elem).attr('href'),
					image: $(elem).find('img').attr('data-src') || $(elem).find('img').attr('src')
				});
			});
			resolve(hasil);
		})
		.catch(reject);
	});
};

module.exports = { 
	wikimedia
};