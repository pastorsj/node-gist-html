// Type definitions for node-gist-html 1.0
// Project: https://github.com/pastorsj/node-gist-html
// Definitions by: Sam Pastoriza <https://github.com/pastorsj>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

interface Options {
    removeLineNumbers: boolean;
    removeFooter: boolean;
}

/**
 * Comverts the gist or github link to html
 * @param type Either gist or github
 * @param link The link to the github file or gist link
 */
export function gistify(link: string, options?: Options): Promise<string>;