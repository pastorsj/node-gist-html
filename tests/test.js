'use strict';

const gistify = require('../lib/node-gist-html.min');
const fs = require('fs');

// gistify('gist', 'dcb242de864e5d2b1c552783a7a00794')
//     .then((result) => {
//         fs.writeFileSync('index.html', result.html);
//     });

gistify('github', 'https://github.com/staltz/react-native-node/blob/master/android/build.gradle')
    .then((result) => {
        fs.writeFileSync('index.html', result.html);
    });
