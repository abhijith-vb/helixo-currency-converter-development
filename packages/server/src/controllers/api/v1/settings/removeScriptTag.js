const removeScriptTag = async shopify => {
    const availableScriptTags = await shopify.scriptTag.list();
    console.log(`Available Scripts: `, availableScriptTags);

    const removeScriptTagsPromise = availableScriptTags.map(async script => {
        const scriptTagId = script.id;
        const deleteScriptTagResponse = await shopify.scriptTag.delete(scriptTagId);
        console.log(`Removed Script Tag`, deleteScriptTagResponse);
    });

    await Promise.all(removeScriptTagsPromise);
};

module.exports = removeScriptTag;
