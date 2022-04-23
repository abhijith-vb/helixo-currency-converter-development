/**
 * All built files are copied to the /server/dist
 */
const shelljs = require('shelljs');
const braces = require('braces');

function afterBuild() {
    // Create server/dist if not available
    shelljs.mkdir('-p', '../server/dist');
    // Clean all client files from server/dist 
    const clientFiles = 'service-worker.js,robots.txt,manifest.json,index.html,favicon.ico,embed.js,asset-manifest.json,locales,static,precache-*';
    const expandedFiles = braces(`../server/dist/{${clientFiles}}`, { expand: true });
    shelljs.rm('-rf', expandedFiles);

    /**
     *  Copy all contents of ./build/* and server/dist/
     */
    shelljs.cp('-fR', './build/*', '../server/dist/');
    // Delete the map files from dist
    shelljs.rm('-rf', '../server/dist/static/js/*.js.map');
}

afterBuild();