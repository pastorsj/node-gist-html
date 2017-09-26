'use strict';

import request from 'request';
import cheerio from 'cheerio';
import { minify } from 'html-minifier';
import isUrl from 'is-url';

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
                html: minify(stylesheet + '\n' + response.div, {
                    conservativeCollapse: true
                }),
                file: minify(response.div, {
                    conservativeCollapse: true
                }),
                stylesheet: minify(stylesheet, {
                    conservativeCollapse: true
                })
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
                    styles += $.html(this);
                }
            });
            styles = styles + '<link rel=stylesheet type=text/css href=https://assets-cdn.github.com/assets/gist-embed-40aceec172c5b3cf62f5333920ddab3a7342a1d12dfdd1581f49f0f35fc0de4a.css>'; // eslint-disable-line

            let meta = `<div class="gist-meta">
                <a href="${rawURL}" style="float:right">view raw</a>
                <a href="${url}">${filename}</a> hosted with &#10084; by <a href="https://github.com">GitHub</a>
            </div>`;

            file = `<div class="gist"><div class="file">${file}${meta}</div></div>`;

            resolve({
                styles: minify(styles, {
                    conservativeCollapse: true
                }),
                file: minify(file, {
                    conservativeCollapse: true
                }),
                html: minify(styles + file, {
                    conservativeCollapse: true
                })
            });
        } catch(e) {
            reject(e);
        }
    });
}

export default function gistify(link) {
    if (isUrl(link)) {
        if(link.includes('gist.github.com')) {
            // It is a GIST url
            const id = link.split('/').slice(-1)[0];

            return new Promise((resolve, reject) => {
                // It is a github link
                const url = 'https://gist.github.com/' + id + '.json';

                request(url, (err, resp, body) => {
                    if (err) {
                        reject('An error has occured', err);
                    }
                    if (body) {
                        retrieveGist(JSON.parse(body))
                            .then((response) => resolve(response))
                            .catch((err) => reject(err));
                    } else {
                        reject('Failed to load the gist');
                    }
                });
            });
        } else if (link.includes('github.com')) {
            // It is a github link
            return new Promise((resolve, reject) => {
                const url = link;
                const filename = url.split('/').pop();

                request(url, (err, resp, body) => {
                    if (err) {
                        reject(err);
                    }
                    convertGithubCode(body, url, filename)
                        .then(result => resolve(result))
                        .catch(err => reject(err));
                });
            });
        }
        return Promise.reject(`Invalid url! It needs to either be a url of type "github.com" 
        or "gist.github.com" or you need to pass the id of the GIST`);
    }
    return new Promise((resolve, reject) => {
        // It is a gist id
        const id = link;
        const url = 'https://gist.github.com/' + id + '.json';

        request(url, (err, resp, body) => {
            if (err) {
                reject('An error has occured', err);
            }
            if (body) {
                retrieveGist(JSON.parse(body))
                    .then((response) => resolve(response))
                    .catch((err) => reject(err));
            } else {
                reject(`Failed to load the gist. We assume that you are sending an ID for 
                the Gist you want to load. If you want to send a url, make sure that it 
                is of type "github.com" or "gist.github.com"`);
            }
        });
    });
}
