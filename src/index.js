'use strict';
// import api from './api';
import request from 'request';

import cheerio from 'cheerio';
// <script src="https://gist.github.com/pastorsj/dcb242de864e5d2b1c552783a7a00794.js"></script>

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
                div: response.div,
                stylesheet
            });
        } else {
            reject('Failed loading gist');
        }
    });
}

export function gistify(type, options) {
    return new Promise((resolve, reject) => {
        if (type === 'github') {
            // It is a github link
            const url = options.url;

            request(url, (err, resp, body) => {
                if (err) {
                    reject(err);
                }
                const $ = cheerio.load(body);
                let file = $('.file').html();

                $('link[rel=stylesheet]').each((index, element) => {
                    console.log('html', $(this).html());
                });
                // const sheets = $('link[rel=stylesheet]').each().html();

                // console.log('sheets', sheets);

                if (file) {
                    file = cheerio.load(file);
                    // console.log('html', file.html());
                }
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
                        .then((response) => {
                            resolve(response);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    reject('Failed to load the gist');
                }
            });
        } else {
            reject('Type not supported yet: ', type);
        }
    });
    // Parse url to determine whether the url is valid and needs to be converted as a github link or gist link.
}
