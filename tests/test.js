'use strict';

const html = require('../lib/node-gist-html');

html.gistify('github', {
    url: 'https://github.com/LighthouseBlog/Blog/blob/master/src/main.ts'
}).then((result) => {
    console.log('Result', result.html);
});
