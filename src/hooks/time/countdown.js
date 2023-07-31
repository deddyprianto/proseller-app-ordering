import moment from 'moment';
import React from 'react';

const useCountdownHooks = () => {
  const [time, setTime] = React.useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });
  const [start, setStart] = React.useState(false);
  let timerId = null;

  const secondsToTime = (onFinish, date) => {
    const today = moment().unix();
    const endDate = moment(date).unix();
    const differenceTime = endDate - today;
    if (differenceTime >= 0) {
      let days = Math.floor(differenceTime / (60 * 60 * 24)).toString();
      let hours = Math.floor((differenceTime / (60 * 60)) % 24).toString();
      const divisor_for_minutes = differenceTime % (60 * 60);
      let minutes = Math.floor(divisor_for_minutes / 60).toString();
      const divisor_for_seconds = divisor_for_minutes % 60;
      let seconds = Math.ceil(divisor_for_seconds).toString();
      days = Number(days) >= 10 ? days : `0${days}`;
      hours = Number(hours) >= 10 ? hours : `0${hours}`;
      minutes = Number(minutes) >= 10 ? minutes : `0${minutes}`;
      seconds = Number(seconds) >= 10 ? seconds : `0${seconds}`;
      const obj = {
        days,
        hours,
        minutes,
        seconds,
      };
      setTime(obj);
      return setStart(true);
    }
    if (onFinish) {
      onFinish();
    }
    clearInterval(timerId);
  };

  const countdownStart = async (onFinish, date) => {
    if (date) {
      timerId = setInterval(() => {
        secondsToTime(onFinish, date);
      }, 1000);
    }
  };

  return {time, timerId, countdownStart, secondsToTime, start};
};

export default useCountdownHooks;
