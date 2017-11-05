import fs from 'fs';
import pixelmatch from 'pixelmatch';
import png from 'pngjs';

import { gistify } from '../../../src/index';


export function retrieveScreenshot(done, url, htmlLocation, options = {}) {
    gistify(url, options).then((result) => {
        fs.writeFileSync(htmlLocation, result.html);
        done();
    }).catch((err) => {
        done(err);
    });
}

export function compareImages(newImageLocation, originalImageLocation, diffImageLocation) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(originalImageLocation)) {
            fs.copyFileSync(newImageLocation, originalImageLocation);
            resolve(true);
        }
        const generated = fs.createReadStream(newImageLocation).pipe(new png.PNG());
        generated.on('parsed', () => {
            const reference = fs.createReadStream(originalImageLocation).pipe(new png.PNG());
            reference.on('parsed', () => {
                const diff = new png.PNG({ width: reference.width, height: reference.height });
                const pixelsDifference = pixelmatch(generated.data, reference.data, diff.data, generated.width, reference.height, { threshold: 0.1 });
                if (pixelsDifference > 0) {
                    diff.pack().pipe(fs.createWriteStream(diffImageLocation));
                    resolve(false);
                }
                resolve(true);
            });
            reference.on('error', reject);
        });
        generated.on('error', reject);
    });
}
