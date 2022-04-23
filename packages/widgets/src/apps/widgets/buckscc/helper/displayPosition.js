const displayPosition = (type, config) => {
    if (type === 'mobile') {
        if (config.customOptionsPlacementMobile) {
            return `mobile_${config.optionsPlacementTypeMobile}`;
        }
    } else if (config.customOptionsPlacement) {
        return ` ${config.optionsPlacementType}`;
    }
};
export default displayPosition;
