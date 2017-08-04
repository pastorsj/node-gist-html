'use strict';

import request from 'request';
import cheerio from 'cheerio';

function retrieveGist(response) {
    return new Promise((resolve, reject) => {
        // the html payload is in the div property
        if (response && response.div) {
        // github returns /assets/embed-id.css now, but let's be sure about that
            if (response.stylesheet) {
                // github passes down html instead of a url for the stylehsheet now
                // parse off the href
                if (response.stylesheet.indexOf('<link') === 0) {
                    response.stylesheet =
                        response.stylesheet
                        .replace(/\\/g, '')
                        .match(/href=\"([^\s]*)\"/)[1];
                } else if (response.stylesheet.indexOf('http') !== 0) {
                // add leading slash if missing
                    if (response.stylesheet.indexOf('/') !== 0) {
                        response.stylesheet = '/' + response.stylesheet;
                    }
                    response.stylesheet = 'https://gist.github.com' + response.stylesheet;
                }
            }

            const stylesheet = `<link rel=stylesheet type=text/css href=${response.stylesheet}>`;

            resolve({
                html: stylesheet + '\n' + response.div,
                file: response.div,
                stylesheet
            });
        } else {
            reject('Failed loading gist');
        }
    });
}

function convertGithubCode(body, url, filename) {
    return new Promise((resolve, reject) => {
        try {
            const $ = cheerio.load(body);
            let styles = '';
            let rawURL = $('#raw-url').attr('href');

            rawURL = 'https://raw.githubusercontent.com' + rawURL.replace('/raw', '');;
            $('.file-header').remove();
            let file = $('.file').html();

            $('link[rel=stylesheet]').each(function (index, element) {
                const href = $(this).attr('href');

                if (href.indexOf('frameworks-') === -1) {
                    styles += `<link rel=stylesheet type=text/css href=${href}>`;
                }
            });
            styles = styles + '<link rel=stylesheet type=text/css href=https://assets-cdn.github.com/assets/gist-embed-40aceec172c5b3cf62f5333920ddab3a7342a1d12dfdd1581f49f0f35fc0de4a.css>'; // eslint-disable-line

            let meta = `<div class="gist-meta">
                <a href="${rawURL}" style="float:right">view raw</a>
                <a href="${url}">${filename}</a> hosted with &#10084; by <a href="https://github.com">GitHub</a>
            </div>`;

            file = `<div class="gist"><div class="file">${file}${meta}</div></div>`;

            resolve({
                styles,
                file,
                html: styles + file
            });
        } catch(e) {
            reject(e);
        }
    });
}

export function gistify(type, options) {
    return new Promise((resolve, reject) => {
        if (type === 'github') {
            // It is a github link
            const url = options.url;
            const filename = url.split('/').pop();

            request(url, (err, resp, body) => {
                if (err) {
                    reject(err);
                }
                convertGithubCode(body, url, filename)
                    .then((result) => resolve(result))
                    .catch((err) => reject(err));
            });
        } else if (type === 'gist') {
            // It is a gist link
            const id = options.id;
            const url = 'https://gist.github.com/' + id + '.json';

            request(url, (err, resp, body) => {
                if (err) {
                    reject('An error has occured', err);
                }
                if (resp.data) {
                    retrieveGist(resp.data)
                        .then((response) => resolve(response))
                        .catch((err) => reject(err));
                } else {
                    reject('Failed to load the gist');
                }
            });
        } else {
            reject('Type not supported yet: ', type);
        }
    });
}
