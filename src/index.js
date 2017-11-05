import request from 'request';
import isUrl from 'is-url';
import retrieveGist from './converters/gist';
import convertGithubCode from './converters/github';

const lineTester = /L\d+-L\d+/g;
const lineExtractor = /L\d+/g;

// https://gist.github.com/pastorsj/dcb242de864e5d2b1c552783a7a00794#file-test-js-L1-L3
// https://github.com/pastorsj/blog-api/blob/master/index.html#L15-L22
function hasLineNumbers(link) {
    if (lineTester.test(link)) {
        const lineNumbers = link.split('#').slice(-1)[0];
        const lines = lineNumbers.match(lineTester);

        if (lines.length > 0) {
            const lineRange = lines[0];
            const gistName = lineNumbers.substring(0, lineNumbers.length - lineRange.length);
            const lineArray = lineRange.match(lineExtractor);

            if (lineArray.length === 2) {
                const startLine = lineArray[0].slice(1);
                const endLine = lineArray[1].slice(1);

                return {
                    startLine: parseInt(startLine, 10),
                    endLine: parseInt(endLine, 10),
                    gistName
                };
            }
        }
    }
    return false;
}

function stripLineNumbers(link) {
    return link.split('#')[0];
}

export function gistify(link, options = {}) {
    try {
        if (isUrl(link)) {
            if (link.includes('gist.github.com')) {
                const lineNumbers = hasLineNumbers(link);

                if (lineNumbers) {
                    options.lineNumbers = lineNumbers;
                    link = stripLineNumbers(link);
                }
                // It is a GIST url
                const id = link.split('/').slice(-1)[0];

                return new Promise((resolve, reject) => {
                    // It is a github link
                    const url = `https://gist.github.com/${id}.json`;

                    request(url, (err, resp, body) => {
                        if (err) {
                            reject('An error has occured', err);
                        }
                        if (body) {
                            retrieveGist(JSON.parse(body), options)
                                .then(response => resolve(response))
                                .catch(err => reject(err));
                        } else {
                            reject('Failed to load the gist');
                        }
                    });
                });
            } else if (link.includes('github.com')) {
                const lineNumbers = hasLineNumbers(link);

                if (lineNumbers) {
                    options.lineNumbers = lineNumbers;
                    link = stripLineNumbers(link);
                }
                // It is a github link
                return new Promise((resolve, reject) => {
                    const url = link;
                    const filename = url.split('/').pop();

                    request(url, (err, resp, body) => {
                        if (err) {
                            reject(err);
                        }
                        convertGithubCode(body, url, filename, options)
                            .then(result => resolve(result))
                            .catch(err => reject(err));
                    });
                });
            }
            // eslint-disable-next-line
            return Promise.reject('Invalid url! It needs to either be a url of type "github.com" or "gist.github.com" or you need to pass the id of the GIST');
        }
        return new Promise((resolve, reject) => {
            // It is a gist id
            const id = link;
            const url = `https://gist.github.com/${id}.json`;

            request(url, (err, resp, body) => {
                if (err) {
                    reject('An error has occured', err);
                }
                if (body) {
                    try {
                        const parsedBody = JSON.parse(body);

                        retrieveGist(parsedBody, options)
                            .then(response => resolve(response))
                            .catch(err => reject(err));
                    } catch (e) {
                        // eslint-disable-next-line
                        reject('Failed to load the gist. We assume that you are sending an ID for the Gist you want to load. If you want to send a url, make sure that it is of type "github.com" or "gist.github.com"'); 
                    }
                } else {
                    // eslint-disable-next-line
                    reject('Failed to load the gist. We assume that you are sending an ID for the Gist you want to load. If you want to send a url, make sure that it is of type "github.com" or "gist.github.com"');
                }
            });
        });
    } catch (e) {
        return Promise.reject(e);
    }
}
