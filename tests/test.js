'use strict';

const html = require('../lib/node-gist-html');

html.gistify('gist', {
    id: 'dcb242de864e5d2b1c552783a7a00794'
}).then((result) => {
    console.log('Final result', result);
});
