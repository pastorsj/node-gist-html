import { minify } from 'html-minifier';
import cheerio from 'cheerio';

function removeLines($, lineNumbers) {
    const start = lineNumbers.startLine;
    const end = lineNumbers.endLine;
    const { gistName } = lineNumbers;
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

function formatCode($) {
    // eslint-disable-next-line
    $('td.blob-code').each(function(index, element) {
        const outer = $.html(this);
        const inner = $(this).html();
        const replacement = `<pre><code>${$(this).html()}</code></pre>`;
        const replaced = outer.replace(inner, replacement);
        $(this).replaceWith($(replaced));
    });
}

function retrieveGist(response, options) {
    return new Promise((resolve, reject) => {
        try {
            if (response && response.div) {
                if (response.stylesheet) {
                    if (response.stylesheet.indexOf('<link') === 0) {
                        // eslint-disable-next-line
                        response.stylesheet = response.stylesheet
                            .replace(/\\/g, '')
                            .match(/href=\"([^\s]*)\"/)[1];
                    } else if (response.stylesheet.indexOf('http') !== 0) {
                    // add leading slash if missing
                        if (response.stylesheet.indexOf('/') !== 0) {
                            response.stylesheet = `/${response.stylesheet}`;
                        }
                        response.stylesheet = `https://gist.github.com${response.stylesheet}`;
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
                formatCode($);

                const file = $.html();

                const stylesheet = `<link rel=stylesheet type=text/css href=${response.stylesheet}>`;

                resolve({
                    html: minify(`<div contenteditable="false">${stylesheet}\n${file}</div><br/>`, {
                        conservativeCollapse: true
                    }),
                    file: minify(`<div contenteditable="false">${file}</div><br/>`, {
                        conservativeCollapse: true
                    }),
                    stylesheet: minify(stylesheet, {
                        conservativeCollapse: true
                    })
                });
            } else {
                reject(new Error('Failed to load gist'));
            }
        } catch (e) {
            reject(new Error('Failed to load gist'));
        }
    });
}

export default retrieveGist;
