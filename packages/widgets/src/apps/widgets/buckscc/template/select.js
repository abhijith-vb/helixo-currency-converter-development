import '../themes/flag.scss';

function generateTemplate(config) {
    let template = `<select id="bucksSelector" class="buckcc">`;
    config.selectedCurrencies.forEach(item => {
        const key = Object.keys(item)[0];
        const val = config.showCurrencyCodesOnly ? key : item[key];
        template += `<option data-flag="${item}" id=${key}  class="converterTriggers" value="${key}">${val}</option>`;
    });

    template += `</select> `;

    return template;
}
export default generateTemplate;
