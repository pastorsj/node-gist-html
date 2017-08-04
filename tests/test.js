'use strict';

const html = require('../lib/node-gist-html');
const fs = require('fs');

html.gistify('github', {
    url: 'https://github.com/pastorsj/node-gist-html/blob/master/tests/index.html'
}).then((result) => {
    fs.writeFileSync('index.html', result.html);
});
