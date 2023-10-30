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

  const handleOpenStore = item => {
    try {
      let operationalHours = item.operationalHours;

      let date = new Date();
      var dd = date.getDate();
      var mm = date.getMonth() + 1;
      var yyyy = date.getFullYear();
      let currentDate = mm + '/' + dd + '/' + yyyy;
      let day = date.getDay();
      let time = date.getHours() + ':' + date.getMinutes();

      let open;
      operationalHours
        .filter(item => item.day == day && item.active == true)
        .map(day => {
          if (
            Date.parse(`${currentDate} ${time}`) >=
              Date.parse(`${currentDate} ${day.open}`) &&
            Date.parse(`${currentDate} ${time}`) <
              Date.parse(`${currentDate} ${day.close}`)
          ) {
            open = true;
          }
        });

      if (open) {
        return true;
      } else {
        if (operationalHours.leading == 0) {
          return true;
        } else {
          return false;
        }
      }
    } catch (e) {
      return false;
    }
  };

  return {
    convertTime,
    handleOpenStore,
  };
};

export default useTime;
