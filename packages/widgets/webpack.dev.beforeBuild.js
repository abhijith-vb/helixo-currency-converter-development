/**
 * This file deals with the operations to be done after the webpack build
 */

const shelljs = require('shelljs');
const braces = require('braces');
const path = require('path');

async function afterBuild() {
    /**
     *  Create directory /widgets and /scripts in server
     *  Recursively create widgets and scripts directory
     */
    // Remove from server/dist
    shelljs.rm('-rf', braces('../server/dist/{widgets,pages}', { expand: true }));
    shelljs.mkdir('-p', braces('../server/dist', { expand: true }));

    // Remove contents of widgets/dist/*
    shelljs.rm('-rf', braces('./dist/{widgets,pages}', { expand: true }));
    // Create folders in widgets/dist
    shelljs.mkdir('-p', braces('./dist/{widgets,pages/demo}', { expand: true }));

    /**
     *  Copy index.html to dist/pages/demo
     */
    shelljs.cp('-fR', path.join(`${__dirname}/src/pages/demo/public/*`), path.join(`${__dirname}/dist/pages/demo/`));
    /**
     *  Symlink all contents of widgets/dist/widgets and server/dist/widgets
     */
    shelljs.ln(
        '-sf',
        path.join(`${__dirname}/dist/widgets/`),
        path.join(path.normalize(`${__dirname}/../server/dist/widgets/`))
    );

    /**
     *  Copy all contents of widgets/dist/pages and server/dist/scripts
     */ shelljs.ln(
        '-sf',
        path.join(`${__dirname}/dist/pages/`),
        path.join(path.normalize(`${__dirname}/../server/dist/pages/`))
    );
}

//  Invoke afterbuild

afterBuild();
