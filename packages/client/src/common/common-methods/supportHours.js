const isSupportHours = () => {
    /**
     * get local time to IST
     * then compare with out working hours
     */

    const date = new Date();
    const utcDate = date.getTime() + date.getTimezoneOffset() * 60000;
    const istDate = new Date(utcDate + 3600000 * +5.5);
    const currentIstHour = istDate.getHours();
    if (currentIstHour < 23 && currentIstHour > 7) return true;
    return false;
};
export default isSupportHours;