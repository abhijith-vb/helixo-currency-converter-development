import { FLOATING_BOX, CURRENCY_BOX } from './constants';

const placementType = (target, position, positionType) => {
    const converterWrapperElement = `<div class="buckscc-currency-box" ></div>`;
    const converterFloatingElement = `<div class="buckscc-floating-box" ></div>`;
    if (hxo$(CURRENCY_BOX).length === 0 || positionType === 'floating') {
        if (positionType !== 'floating') {
            switch (position) {
                case 'before':
                    hxo$(target).before(converterWrapperElement);
                    break;
                case 'after':
                    hxo$(target).after(converterWrapperElement);
                    break;
                case 'prepend':
                    hxo$(target).prepend(converterWrapperElement);
                    break;
                case 'append':
                    hxo$(target).append(converterWrapperElement);
                    break;

                default:
                    hxo$(target).after(converterWrapperElement);
                    break;
            }
        } else if (hxo$(FLOATING_BOX).length === 0) hxo$(target).append(converterFloatingElement);
    }
};
export default placementType;
