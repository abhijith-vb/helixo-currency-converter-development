// Code will only appear in production build.
const url = new URLSearchParams(window.location.search);
const shop = url.get("shop");
const apiKey = url.get("key");
var AppBridge = window["app-bridge"];
var createApp = AppBridge.default;
var actions = AppBridge.actions;
var History = actions.History;

function initializeApp() {
    var app = createApp({
        apiKey: apiKey,
        shopOrigin: `//${shop}`
    });

    var history = History.create(app);
    history.dispatch(History.Action.PUSH, window.location.pathname);

    return app;
}
if (shop && apiKey) initializeApp();