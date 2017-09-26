// Type definitions for node-gist-html 1.0
// Project: https://github.com/pastorsj/node-gist-html
// Definitions by: Sam Pastoriza <https://github.com/pastorsj>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/**
 * Comverts the gist or github link to html
 * @param type Either gist or github
 * @param link The link to the github file or gist link
 */
export default function gistify(link: string): Promise<string>;