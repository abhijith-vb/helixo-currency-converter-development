import axios from "axios";
import API_URL from "../../environments/Environments";
// import { storeAuthenticate } from './../authentication/storeAuthentication';

const getBaseUrl = url => {
    return API_URL.url + url;
    // return url && url[0] === "/" ? url : "/" + url;
};


const httpProvider = {
    getAction: url => axios.get(getBaseUrl(url)),
    postAction: (url, payload) => axios.post(getBaseUrl(url), payload),
    deleteAction: (url, payload) => axios.delete(getBaseUrl(url)),
    patchAction: (url, payload) => axios.patch(url, payload),
    setAuthorizationToken: token => {
        if (token) {
            axios.defaults.headers.common["X-BUCKSCC-AUTH"] = token;
        } else {
            delete axios.defaults.headers.common["X-BUCKSCC-AUTH"];
        }
    }
};

export default httpProvider;
