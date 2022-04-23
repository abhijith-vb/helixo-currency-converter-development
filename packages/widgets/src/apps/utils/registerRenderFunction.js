export default function renderApps(data) {
    const sortData = (data || []).sort((a, b) => a.sortOrder - b.sortOrder);
    sortData.forEach(eachAppData => {
        const { appId, selectorId } = eachAppData;
        if (typeof eachAppData.config === 'string') eachAppData.config = JSON.parse(eachAppData.config);
        if (window.buckscc && window.buckscc.apps && window.buckscc.apps[appId])
            window.buckscc.apps[appId](selectorId, eachAppData);
    });
}
