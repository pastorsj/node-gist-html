import { minify } from 'html-minifier';
import cheerio from 'cheerio';

function removeLines($, lineNumbers) {
    const start = lineNumbers.startLine;
    const end = lineNumbers.endLine;
    let i = 0;

    while (true) {
        i++;
        if (i >= start && i <= end) {
            continue;
        }
        const line = $(`#L${i}`).get();

        if (line.length > 0) {
            $(`#L${i}`).parent().remove();
        } else {
            break;
        }
    }
}

function convertGithubCode(body, url, filename, options) {
    return new Promise((resolve, reject) => {
        try {
            const $ = cheerio.load(body);
            let styles = '';
            let rawURL = $('#raw-url').attr('href');

            rawURL = `https://raw.githubusercontent.com${rawURL.replace('/raw', '')}`;

            $('.file-header').remove();
            $('.BlobToolbar').remove();

            if (options.removeLineNumbers) {
                $('.blob-num').remove();
            }
            if (options.lineNumbers) {
                removeLines($, options.lineNumbers);
            }

            let file = $('.file').html();

            $('link[rel=stylesheet]').each(function (index, element) {
                const href = $(this).attr('href');
                if (href.indexOf('frameworks-') === -1) {
                    styles += $.html(this);
                }
            });
            styles = styles + '<link rel=stylesheet type=text/css href=https://assets-cdn.github.com/assets/gist-embed-40aceec172c5b3cf62f5333920ddab3a7342a1d12dfdd1581f49f0f35fc0de4a.css>'; // eslint-disable-line

            if (options.removeFooter) {
                file = `<div class="gist"><div class="file">${file}</div></div>`;
            } else {
                const meta = `
                <div class="gist-meta">
                    <a href="${rawURL}" style="float:right">view raw</a>
                    <a href="${url}">${filename}</a> hosted with &#10084; by <a href="https://github.com">GitHub</a>
                </div>`;

                file = `<div class="gist"><div class="file">${file}${meta}</div></div>`;
            }

            resolve({
                styles: minify(styles, {
                    conservativeCollapse: true
                }),
                file: minify(`<div contenteditable="false">${file}</div><br/>`, {
                    conservativeCollapse: true
                }),
                html: minify(`<div contenteditable="false">${styles}\n${file}</div><br/>`, {
                    conservativeCollapse: true
                })
            });
        } catch (e) {
            reject(new Error('Failed to load github file. Please check the url'));
        }
    });
}

export default convertGithubCode;
