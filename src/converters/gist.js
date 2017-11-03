'use strict';

import { minify } from 'html-minifier';
import cheerio from 'cheerio';

function removeLines($, lineNumbers) {
    const start = lineNumbers.startLine;
    const end = lineNumbers.endLine;
    const gistName = lineNumbers.gistName;
    let i = 0;

    while (true) {
        i++;
        if (i >= start && i <= end) {
            continue;
        }
        const line = $(`#${gistName}L${i}`).get();

        if (line.length > 0) {
            $(`#${gistName}L${i}`).parent().remove();
        } else {
            break;
        }
    }
}

function retrieveGist(response, options) {
    return new Promise((resolve, reject) => {
        try {
            if (response && response.div) {

                if (response.stylesheet) {

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

                const $ = cheerio.load(response.div);

                if (options.removeLineNumbers) {
                    $('.blob-num').remove();
                }
                if (options.removeFooter) {
                    $('.gist-meta').remove();
                }
                if (options.lineNumbers) {
                    removeLines($, options.lineNumbers);
                }

                const file = $.html();

                const stylesheet = `<link rel=stylesheet type=text/css href=${response.stylesheet}>`;

                resolve({
                    html: minify(stylesheet + '\n' + file, {
                        conservativeCollapse: true
                    }),
                    file: minify(file, {
                        conservativeCollapse: true
                    }),
                    stylesheet: minify(stylesheet, {
                        conservativeCollapse: true
                    })
                });
            } else {
                reject('Failed to load gist');
            }
        } catch (e) {
            reject('Failed to load gist');
        }
    });
}

export default retrieveGist;
