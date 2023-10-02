import moment from 'moment';

const useTime = () => {
  const convertTime = (time, isFollowMembership, defaultExpiryDays) => {
    if (isFollowMembership) {
      return 'Follows Membership Expiry';
    }
    if (!time && defaultExpiryDays) {
      return `In ${defaultExpiryDays} days`;
    }
    if (!time && !defaultExpiryDays) {
      return 'In 30 days';
    }
    const now = moment();
    const utc = now;
    const date = moment.utc(time);

    const days = date.diff(utc, 'days');
    if (days > 0) {
      return `In ${days} ${days > 1 ? 'days' : 'day'}`;
    }
    return 'In 0 day';
  };

  const handleOpenStore = (item, isOrderAvailable) => {
    let operationalHour = [];
    if (item?.operationalHours && Array.isArray(item?.operationalHours)) {
      operationalHour = item?.operationalHours;
    }
    if (isOrderAvailable) {
      if (item?.openAllDays) {
        return true;
      }
      const day = moment().day();
      const getOperationalHour = operationalHour?.find(
        operational => operational?.day == day,
      );

      if (getOperationalHour) {
        const closeTime =
          moment().format('YYYY-MM-DD ') + getOperationalHour?.close;
        const openTime =
          moment().format('YYYY-MM-DD ') + getOperationalHour?.open;
        const unixTimeNow = moment().unix();
        const unixTimeClose = moment(closeTime).unix();
        const unixTimeOpen = moment(openTime).unix();
        if (unixTimeNow >= unixTimeOpen && unixTimeNow <= unixTimeClose) {
          return true;
        }
        return false;
      }
      return false;
    }
    return false;
  };

  return {
    convertTime,
    handleOpenStore,
  };
};

export default useTime;
