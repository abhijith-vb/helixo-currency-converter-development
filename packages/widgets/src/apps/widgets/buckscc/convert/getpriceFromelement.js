import Filterprice from '../helper/filterPrice';

export default function getpriceFromelement(childrenExists, self, config, to, setDataVals) {
    let val;
    const issetDataVals = setDataVals || false;
    if (!childrenExists) {
        val = hxo$(self).html();
    } else {
        const nestedChildrenExists = !!hxo$(self).children().children().length;
        if(nestedChildrenExists){
            val = hxo$(self)
                .children()
                .children()
                .html();
        }
        else{

            val = hxo$(self)
                .children()
                .html();
        }
    }
    if (!issetDataVals) {
        const originalVal = val;
        hxo$(self).data(`buckscc-originalPrice`, `${originalVal}`);
        val = Filterprice(val, config.baseMoneyFormat, to, config.baseCurrency);
        hxo$(self).data(`buckscc-initVal`, `${val}`);
    }
    return val;
}
