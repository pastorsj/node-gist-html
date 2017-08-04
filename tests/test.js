'use strict';

const html = require('../lib/node-gist-html');
const fs = require('fs');

// html.gistify('gist', {
//     id: 'dcb242de864e5d2b1c552783a7a00794'
// }).then((result) => {
//     fs.writeFileSync('index.html', result.html);
// });

html.gistify('github', {
    url: 'https://github.com/staltz/react-native-node/blob/master/android/build.gradle'
}).then((result) => {
    fs.writeFileSync('index.html', result.html);
});
