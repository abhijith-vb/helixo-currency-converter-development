/* eslint-disable prefer-destructuring */
// rollup.config.js
// import scss from 'rollup-plugin-scss';
import postcss from 'rollup-plugin-postcss';
import isEmpty from 'lodash/isEmpty';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import dotenv from 'dotenv';
import replace from '@rollup/plugin-replace';
// import serve from 'rollup-plugin-serve';
// import livereload from 'rollup-plugin-livereload';
import path from 'path';
// Node resolve will resolve index.js if import from folder that contains index.js is used
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const shell = require('shelljs');
const args = require('minimist')(process.argv.slice(2));

const env = dotenv.config();

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

console.log(`input`, inputFile);
console.log(`output`, outputFile);
console.log(`env`, env.parsed.ENVIRONMENT);

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
const destinationWidgetFile = '../server/dist/widgets/buckscc/sdk.min.js';
const destinationWidgetMapFile = '../server/dist/widgets/buckscc/sdk.min.js.map';
// Delete if symlink already exists, because sometimes ln -fs may not work
shell.rm('-rf', destinationWidgetFile);
// Link current widget bundle to injected script
// shell.ln('-fs', sourceWidgetFile, destinationWidgetFile);
// Link sourcemap file for debugging purposes
// shell.ln('-fs', `${sourceWidgetFile}.map`, destinationWidgetMapFile);

/* *******************
 * Rollup configuration
 ********************* */

export default {
    input: `${inputFile}`,
    output: {
        file: `${outputFile}`,
        name: 'buckscc.widgets',
        format: 'iife',
        sourcemap: true
    },

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
        replace({ __Env__: env.parsed.ENVIRONMENT })
        // Auto serve after first run
        // serve({
        //     port: 4001,
        //     open: true,
        //     contentBase: [outputDir]
        // }),
        // Live reload on changes
        // livereload()
    ]
};
