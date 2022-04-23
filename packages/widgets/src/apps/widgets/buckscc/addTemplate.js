import defaultTheme from './template/select';
import defaultEvents from './template/selectEvents';
import setSelectedTemplate from './setSelectedTemplate';

// add user selected template and events
export default function addTemplate(config) {
    let content;
    let cls;
    const wrapper = '.buckscc-currency-wrapper';

    switch (config.themeType) {
        case 'select-round':
            content = defaultTheme(config);
            cls = `hxoSelectTheme hxoSelectRoundTheme`;

            setSelectedTemplate(config, content, cls, defaultEvents, wrapper);

            break;
        case 'modernLayered':
            content = defaultTheme(config);
            cls = `hxoSelectTheme hxoModernLayeredTheme`;

            setSelectedTemplate(config, content, cls, defaultEvents, wrapper);
            break;
        default:
            content = defaultTheme(config);
            cls = `hxoSelectTheme`;

            setSelectedTemplate(config, content, cls, defaultEvents, wrapper);
            break;
    }
}
