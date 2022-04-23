/* eslint-disable prefer-destructuring */
// rollup.config.js
// import scss from 'rollup-plugin-scss';
import postcss from 'rollup-plugin-postcss';
import isEmpty from 'lodash/isEmpty';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { terser } from 'rollup-plugin-terser';
import path from 'path';
// Node resolve will resolve index.js if import from folder that contains index.js is used
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import shell from 'shelljs';
import braces from 'braces';

const args = require('minimist')(process.argv.slice(2));

// Get params from npm run watch
const externalParameters = args._;
const watchParams = {};
externalParameters.forEach(w => {
    watchParams[w.split('=')[0]] = w.split('=')[1];
});
const widgetName = watchParams.widget || process.env.widget || 'buckscc';

/* *******************
 * Create symlink to bundle
 ********************* */

const inputDir = widgetName && `${widgetName}/`;
const inputFile = `./src/apps/widgets/${widgetName ? `${widgetName}/` : ''}index.js`;
const outputDir = `./dist/widgets/${widgetName ? `${widgetName}/` : ''}`;
const outputFile = `${outputDir}sdk.min.js`;
const publicHtml = './public/index.html';

/**
 * Clear out dist folders and create
 */

// Remove from server/dist
shell.rm('-rf', braces('../server/dist/{widgets,pages}', { expand: true }));
shell.mkdir('-p', braces('../server/dist', { expand: true }));
shell.rm('-rf', braces('./dist/{widgets,pages}', { expand: true }));

// Create folders in widgets/dist
shell.mkdir('-p', braces('./dist/{widgets,pages}', { expand: true }));

console.log(`input`, inputFile);
console.log(`output`, outputFile);

/* 
* If npm command have a parameter to run watch for a specific app then,
 - Make sure there is a folder exist in the name of widget in the dist folder
 - Also copy the public/index.html to dist/widget-name/index.html
*/

if (!isEmpty(widgetName)) {
    // Create widget folder in dist
    shell.mkdir('-p', outputDir);
    // Copy public/index.html to dist/widget-name/index.html
    shell.cp('-R', publicHtml, `${outputDir}/index.html`);
    // Create a bundle file if not exists
    shell.touch('-c', outputFile);
}

/* *******************
 * Create symlink to bundle
 ********************* */

const sourceWidgetFile = `${process.cwd()}/${path.normalize(outputFile)}`;
const destinationWidgetFile = '../server/dist/scripts/script.js';
const destinationWidgetMapFile = '../server/dist/scripts/sdk.bundle.js.map';
const destinationFolder = `./dist/widgets/${widgetName ? `${widgetName}` : ``}/*`;
// Delete if symlink already exists, because sometimes ln -fs may not work
shell.rm('-rf', destinationFolder);
// Link current widget bundle to injected script
// shell.ln('-fs', sourceWidgetFile, destinationWidgetFile);
// Link sourcemap file for debugging purposes
// shell.ln('-fs', sourceWidgetFile + '.map', destinationWidgetMapFile);

/* *******************
 * Rollup configuration
 ********************* */

export default {
    input: `${inputFile}`,
    output: [
        // {
        //     file: `${outputDir}/sdk.bundle.js`,
        //     name: `bucksCC.widgets.${widgetName}`,
        //     format: 'iife',
        //     sourcemap: true
        // },
        {
            file: `${outputFile}`,
            name: `bucksCC.widgets.${widgetName}`,
            format: 'iife',
            sourcemap: false
        }
    ],

    watch: {
        clearScreen: false
    },
    plugins: [
        nodeResolve({
            browser: true,
            preferBuiltins: true,
            extensions: ['.js', '.scss', '.css']
        }),
        commonjs({
            include: 'node_modules/**'
        }),
        // scss(),
        postcss({
            plugins: [autoprefixer, cssnano]
        }),
        terser({
            include: [/^.+\.min\.js$/, '*esm*'],
            exclude: ['some*'],
            mangle: true,
            module: true,
            toplevel: true,
            safari10: true,
            keep_fnames: false,
            compress: {
                drop_console: true
            }
        })
    ]
};
