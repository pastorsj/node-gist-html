import webdriver from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { retrieveScreenshot, compareImages } from './common/image.common';

const HTML_FILE = path.join(__dirname, 'test.html');
const OUTPUT_DIRECTORY = path.join(__dirname, 'output');
const REFERENCE_DIRECTORY = path.join(__dirname, 'reference');
const DIFF_DIRECTORY = path.join(__dirname, 'diff');
const url = 'https://github.com/pastorsj/pandora-clone/blob/master/AudioStreaming/src/main/java/pandora/clone/AudioStreamingApplication.java';
const selectedLinesUrl = 'https://github.com/pastorsj/pandora-clone/blob/master/AudioStreaming/src/main/java/pandora/clone/AudioStreamingApplication.java#L8-L14';

describe('Github Snapshot Testing', () => {
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
    describe('Github: Standard Conversion', () => {
        const file = 'github_standard.png';
        before((done) => {
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
                    const newImageLocation = path.join(OUTPUT_DIRECTORY, file);
                    const originalImageLocation = path.join(REFERENCE_DIRECTORY, file);
                    const diffImageLocation = path.join(DIFF_DIRECTORY, file);
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
    describe('Github: Removed Line Numbers', () => {
        const file = 'github_remove_line_numbers.png';
        before((done) => {
            retrieveScreenshot(done, url, HTML_FILE, { removeLineNumbers: true });
        });
        it('should return html that is formatted correctly', (done) => {
            const driver = new webdriver.Builder()
                .withCapabilities(webdriver.Capabilities.chrome())
                .build();

            driver.manage().window().maximize();

            driver.get(`file:///${HTML_FILE}`)
                .then(() => driver.takeScreenshot())
                .then((image) => {
                    const newImageLocation = path.join(OUTPUT_DIRECTORY, file);
                    const originalImageLocation = path.join(REFERENCE_DIRECTORY, file);
                    const diffImageLocation = path.join(DIFF_DIRECTORY, file);
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
    describe('Github: Removed Footer', () => {
        const file = 'github_removed_footer.png';
        before((done) => {
            retrieveScreenshot(done, url, HTML_FILE, { removeFooter: true });
        });
        it('should return html that is formatted correctly', (done) => {
            const driver = new webdriver.Builder()
                .withCapabilities(webdriver.Capabilities.chrome())
                .build();

            driver.manage().window().maximize();

            driver.get(`file:///${HTML_FILE}`)
                .then(() => driver.takeScreenshot())
                .then((image) => {
                    const newImageLocation = path.join(OUTPUT_DIRECTORY, file);
                    const originalImageLocation = path.join(REFERENCE_DIRECTORY, file);
                    const diffImageLocation = path.join(DIFF_DIRECTORY, file);
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
    describe('Github: Removed Line Numbers and Footer', () => {
        const file = 'github_removed_line_numbers_and_footer.png';
        before((done) => {
            retrieveScreenshot(done, url, HTML_FILE, { removeFooter: true, removeLineNumbers: true });
        });
        it('should return html that is formatted correctly', (done) => {
            const driver = new webdriver.Builder()
                .withCapabilities(webdriver.Capabilities.chrome())
                .build();

            driver.manage().window().maximize();

            driver.get(`file:///${HTML_FILE}`)
                .then(() => driver.takeScreenshot())
                .then((image) => {
                    const newImageLocation = path.join(OUTPUT_DIRECTORY, file);
                    const originalImageLocation = path.join(REFERENCE_DIRECTORY, file);
                    const diffImageLocation = path.join(DIFF_DIRECTORY, file);
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
    describe.only('Github: Selected Lines', () => {
        const file = 'github_selected_lines.png';
        before((done) => {
            retrieveScreenshot(done, selectedLinesUrl, HTML_FILE);
        });
        it('should return html that is formatted correctly', (done) => {
            const driver = new webdriver.Builder()
                .withCapabilities(webdriver.Capabilities.chrome())
                .build();

            driver.manage().window().maximize();

            driver.get(`file:///${HTML_FILE}`)
                .then(() => driver.takeScreenshot())
                .then((image) => {
                    const newImageLocation = path.join(OUTPUT_DIRECTORY, file);
                    const originalImageLocation = path.join(REFERENCE_DIRECTORY, file);
                    const diffImageLocation = path.join(DIFF_DIRECTORY, file);
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
