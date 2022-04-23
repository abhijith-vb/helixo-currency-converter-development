import reconvert from './reconvert';

export const reconvertOnInterval = (ms = 1000, loopCount = 3) => {
    let count = 0;
    if (window.bucksCC.conveterInstance)
        clearInterval(window.bucksCC.conveterInstance);
    window.bucksCC.conveterInstance = setInterval(() => {
        console.log(`${count}: Reconverting on interval after ${ms}ms`);
        reconvert();
        if (count >= loopCount) {
            console.log('clearing interval ');
            clearInterval(window.bucksCC.conveterInstance);
        }
        count += 1;
    }, ms);
};
