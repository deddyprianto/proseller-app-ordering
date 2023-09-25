import moment from 'moment';

const CheckOutletStatus = outlet => {
  const currentDay = moment().format('dddd');

  const currentTime = moment().format('YYYY-MM-DD HH:mm');

  const timeFormat = moment().format('YYYY-MM-DD') + ' ';

  const operationalHourActive = outlet?.operationalHours?.some(
    row =>
      row?.nameOfDay === currentDay &&
      moment(currentTime).isBetween(
        moment(timeFormat + row?.open),
        moment(timeFormat + row?.close),
      ),
  );

  if (outlet?.orderingStatus === 'AVAILABLE' && operationalHourActive) {
    return 'OPEN';
  } else if (outlet?.orderingStatus === 'AVAILABLE' && !operationalHourActive) {
    return 'CLOSED';
  } else {
    return 'UNAVAILABLE';
  }
};

export default CheckOutletStatus;
