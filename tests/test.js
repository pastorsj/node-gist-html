'use strict';

const converter = require('./../lib/node-gist-html');
const fs = require('fs');

// converter('dcb242de864e5d2b1c552783a7a00794')
//     .then((result) => {
//         fs.writeFileSync('index.html', result.html);
//     })
//     .catch((err) => {
//         console.error(err);
//     });

// converter('https://google.com')
//     .then((result) => {
//         fs.writeFileSync('index.html', result.html);
//     })
//     .catch((err) => {
//         console.error(err);
//     });

// converter('https://gist.github.com/pastorsj/dcb242de864e5d2b1c552783a7a00794')
//     .then((result) => {
//         fs.writeFileSync('index.html', result.html);
//     })
//     .catch((err) => {
//         console.error(err);
//     });

converter('https://github.com/staltz/react-native-node/blob/master/android/build.gradle')
    .then((result) => {
        fs.writeFileSync('index.html', result.html);
    })
    .catch((err) => {
        console.error(err);
    });

// converter('fs;kladjfoj349jf;')
//     .then((result) => {
//         fs.writeFileSync('index.html', result.html);
//     })
//     .catch((err) => {
//         console.error(err);
//     });

// converter('http://github.com/pastorsj')
//     .then((result) => {
//         fs.writeFileSync('index.html', result.html);
//     })
//     .catch((err) => {
//         console.error(err);
//     });

