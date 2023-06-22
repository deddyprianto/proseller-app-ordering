import moment from 'moment';

export const calculateDateTime = time => {
  const utcZero = {
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  };
  const currentTime = moment(time)
    .utcOffset(0)
    .set(utcZero);
  const nowDate = moment(new Date())
    .utcOffset(0)
    .set(utcZero);
  const now = moment(nowDate).utc();
  const date = moment(currentTime).utc();
  const days = now.diff(date, 'day');
  const messageYear = moment(date).format('yyyy');
  const currentYear = moment().format('yyyy');
  if (days < 0) {
    return null;
  }
  if (days === 0) {
    return `Today at ${moment(time).format('HH:mm')}`;
  }
  if (days > 0 && days < 2) {
    return `Yesterday at ${moment(time).format('HH:mm')}`;
  }
  if (days > 1 && days < 7) {
    return `${moment(time).format('dddd')} at ${moment(time).format('HH:mm')}`;
  }
  if (days > 6 && Number(currentYear) == Number(messageYear)) {
    return `${moment(time).format('DD MMMM')} at ${moment(time).format(
      'HH:mm',
    )}`;
  }
  return `${moment(time).format('DD MMMM yyyy')} at ${moment(time).format(
    'HH:mm',
  )}`;
};
