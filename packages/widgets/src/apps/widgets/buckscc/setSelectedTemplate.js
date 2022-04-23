const setSelectedTemplate = (config, contents, classes, events, wrapper) => {
    hxo$(wrapper).html(contents);
    hxo$(wrapper).addClass(classes);
    events(config);
};
export default setSelectedTemplate;
