import addTemplate from '../addTemplate';
import placementType from './placementType';
import displayPosition from '../helper/displayPosition';
import isMobile from '../../../utils/isMobile';
import { FLOATING_BOX, CURRENCY_BOX } from './constants';

export default function addWrapperDiv(config) {
    let target;
    let isFloating = false;
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    let classes =
        `buckscc-currency-wrapper` +
        ` ${config.borderStyle} ` +
        ` ${config.darkMode ? 'hxoDark' : ''} ` +
        ` ${config.demoMode ? 'hxoSmallSize' : ''} ` +
        ` ${config.showInDesktop ? '' : 'hideOnDesktop'} ` +
        ` ${config.showInMobileDevice ? '' : 'hideOnMobile'}` +
        ` ${config.demoMode ? 'buckscc-ismerchant' : ''}` +
        ` hxo-${config.flagDisplayOption}` +
        ` hxoFlag-${config.flagStyle} hxoFlag-${config.flagTheme}`;

    if (window.matchMedia('(max-width: 767px)').matches && !isLandscape && config.mobileDisplayPositionType) {
        classes +=
            ` bucksMobile ` +
            ` ${config.mobileDisplayPositionType === 'floating'
                ? `mobile_${config.mobileDisplayPosition}`
                : 'hxo-mobile_relative'
            }` +
            ` ${config.customOptionsPlacementMobile ? `mobile_${config.optionsPlacementTypeMobile}` : ''} `;
        if (config.mobileDisplayPositionType === 'floating') {
            target = config.target;
            isFloating = true;
        } else if (config.mobileDisplayPositionType === 'header') {
            target = 'header a[href*="/cart"]';
        } else {
            target = config.mobileCustomPosition;
        }
        placementType(target, config.mobilePositionPlacement, config.mobileDisplayPositionType);
    } else {
        classes +=
            ` bucksDesktop ` +
            `${config.displayPositionType === 'floating' ? `${config.displayPosition}` : 'hxo-relative'}` +
            ` ${config.customOptionsPlacement ? `${config.optionsPlacementType}` : ''} ` +
            ` ${isLandscape && isMobile() ? `hxo-landscape` : ''} `;
        if (config.displayPositionType === 'floating') {
            target = hxo$(config.target);
            isFloating = true;
        } else if (config.displayPositionType === 'header') {
            target = hxo$('header a[href*="/cart"]');
        } else {
            target = hxo$(config.customPosition);
        }

        placementType(target, config.positionPlacement, config.displayPositionType);
    }

    const converterBoxElement = `<div class="${classes} " ></div>`;

    if (
        hxo$(FLOATING_BOX).length !== 0 &&
        hxo$('.buckscc-currency-wrapper').length === 0 &&
        !config.hideCurrencySelector &&
        isFloating
    ) {
        hxo$(converterBoxElement).appendTo(hxo$(FLOATING_BOX));
        // add selected template
        addTemplate(config);
    } else if (
        hxo$(CURRENCY_BOX).length !== 0 &&
        hxo$('.buckscc-currency-wrapper').length === 0 &&
        !config.hideCurrencySelector &&
        !isFloating
    ) {
        hxo$(converterBoxElement).appendTo(hxo$(CURRENCY_BOX));
        // add selected template
        addTemplate(config);
    }
}
