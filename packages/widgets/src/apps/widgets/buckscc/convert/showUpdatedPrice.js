import decodeHtmlEntities from '../helper/decodeHtmlEntities';

export default function showUpdatedPrice(childrenExists, self, newprice) {
      /**
     * with decoded values for html codes for  sybmols like &euro; to €
     */
    const decodedNewPrice = decodeHtmlEntities(newprice);
    hxo$(self).data(`buckscc-currentVal`, `${decodedNewPrice}`);

    if (childrenExists) {
        const nestedChildrenExists = !!hxo$(self).children().children().length;
        if(nestedChildrenExists){
            hxo$(self)
            .children()
            .children()
            .html(decodedNewPrice);
        }
        else{
        hxo$(self)
            .children()
            .html(decodedNewPrice);
        }
    } else {
        hxo$(self).html(decodedNewPrice);
    }
    hxo$(self).addClass('buckscc-converted');
    // hxo$(ele).replaceWith(self);
}
