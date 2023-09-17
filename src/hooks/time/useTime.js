import moment from 'moment';

const useTime = () => {
  const convertTime = time => {
    if (!time) {
      return '';
    }

    const now = moment();
    const utc = now;
    const date = moment.utc(time);

    const days = date.diff(utc, 'days');
    if (days > 0) {
      return `${days} ${days > 1 ? 'days' : 'day'}`;
    }
    return '0 day';
  };

  return {
    convertTime,
  };
};

export default useTime;
