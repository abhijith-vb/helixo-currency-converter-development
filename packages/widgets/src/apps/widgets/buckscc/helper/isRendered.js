const isRendered =new Promise((resolve, reject) => {
        if(!((window ||{}).bucksCC || {}).rendered ){
            window.bucksCC.rendered  = true;
            resolve(true)
        }
        reject(false)
    }
    );
    export default isRendered;