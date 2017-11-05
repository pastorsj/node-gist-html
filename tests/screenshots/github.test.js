import webdriver from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import pixelmatch from 'pixelmatch';
import png from 'pngjs';

import { gistify } from '../../src/index';

const HTML_FILE = path.join(__dirname, 'test.html');
const OUTPUT_DIRECTORY = path.join(__dirname, 'output');
const REFERENCE_DIRECTORY = path.join(__dirname, 'reference');
const DIFF_DIRECTORY = path.join(__dirname, 'diff');

function retrieveScreenshot(done, url, options = {}) {
    gistify(url, options).then((result) => {
        fs.writeFileSync(HTML_FILE, result.html);
        done();
    }).catch((err) => {
        done(err);
    });
}

function compareImages(newImageLocation, originalImageLocation, diffImageLocation) {
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

describe.only('Github Snapshot Testing', () => {
    afterEach((done) => {
        try {
            if (fs.existsSync(HTML_FILE)) {
                fs.unlinkSync(HTML_FILE);
            }
            done();
        } catch (e) {
            done(e);
        }
    });
    describe('Standard Conversion', () => {
        before((done) => {
            const url = 'https://github.com/pastorsj/pandora-clone/blob/master/AudioStreaming/src/main/java/pandora/clone/AudioStreamingApplication.java';
            retrieveScreenshot(done, url);
        });
        it('should return html that is formatted correctly', (done) => {
            const driver = new webdriver.Builder()
                .withCapabilities(webdriver.Capabilities.chrome())
                .build();

            driver.manage().window().maximize();

            driver.get(`file:////${HTML_FILE}`)
                .then(() => driver.takeScreenshot())
                .then((image) => {
                    const newImageLocation = path.join(OUTPUT_DIRECTORY, 'github_standard.png');
                    const originalImageLocation = path.join(REFERENCE_DIRECTORY, 'github_standard.png');
                    const diffImageLocation = path.join(DIFF_DIRECTORY, 'github_standard.png');
                    fs.writeFileSync(newImageLocation, image, 'base64');
                    driver.quit();
                    return compareImages(newImageLocation, originalImageLocation, diffImageLocation);
                })
                .then((comparisonResult) => {
                    if (!comparisonResult) {
                        done(new Error('A visual difference was detected and a diff file was generated'));
                    } else {
                        done();
                    }
                })
                .catch(err => done(err));
        });
    });
});
