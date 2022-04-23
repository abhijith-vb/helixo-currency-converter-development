/**
 * This file deals with the operations to be done after the webpack build
 */

const shelljs = require('shelljs');
const braces = require('braces');
const path = require('path');

function afterBuild() {
    /**
     *  Create directory /widgets and  in server
     *  Recursively create widgets and directory
     */
    shelljs.rm('-rf', braces('../server/dist/{widgets,pages}', { expand: true }));
    shelljs.mkdir('-p', braces('../server/dist/{widgets,pages}', { expand: true }));

    /**
     *  Copy all contents of widgets/dist/widgets and server/dist/widgets
     */
    // Webpack outputs bundle.min.js, so change name to merchant_script.bundle.min.js
    // shelljs.mv('-f', './dist/widgets/main.bundle.min.js', './dist/widgets/merchant_script.bundle.min.js');
    shelljs.cp('-fR', './dist/widgets/*', '../server/dist/widgets/');

    /**
     *  Copy all contents of widgets/dist/pages and server/dist/pages
     */
    //   Copy index.html to dist/pages/demo
    shelljs.cp('-fR', path.join(`${__dirname}/src/pages/demo/public/*`), path.join(`${__dirname}/dist/pages/demo/`));
    shelljs.cp('-fR', './dist/pages/*', '../server/dist/pages/');
}

//  Invoke afterbuild

afterBuild();
