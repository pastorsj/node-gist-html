import webdriver from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { retrieveScreenshot, compareImages } from './common/image.common';

const HTML_FILE = path.join(__dirname, 'test.html');
const OUTPUT_DIRECTORY = path.join(__dirname, 'output');
const REFERENCE_DIRECTORY = path.join(__dirname, 'reference');
const DIFF_DIRECTORY = path.join(__dirname, 'diff');

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
            retrieveScreenshot(done, url, HTML_FILE);
        });
        it('should return html that is formatted correctly', (done) => {
            const driver = new webdriver.Builder()
                .withCapabilities(webdriver.Capabilities.chrome())
                .build();

            driver.manage().window().maximize();

            driver.get(`file:///${HTML_FILE}`)
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
