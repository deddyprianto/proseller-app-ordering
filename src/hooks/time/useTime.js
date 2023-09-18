import moment from 'moment';

const useTime = () => {
  const convertTime = (time, isFollowMembership) => {
    if (isFollowMembership) {
      return 'Follows Membership Expiry';
    }
    if (!time) {
      return '30 days';
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

  return {
    convertTime,
  };
};

export default useTime;
