/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import React, {useState, useEffect} from 'react';

const useCountdownV2 = order => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isTimeEnd, setIsTimeEnd] = useState(false);

  const countdownStart = expiry => {
    const then = moment(expiry).format('MM/DD/YYYY HH:mm:ss');

    const result = setInterval(() => {
      const now = moment().format('MM/DD/YYYY HH:mm:ss');
      const ms = moment(then).diff(moment(now));

      const duration = moment.duration(ms);
      let second = duration.seconds();
      let secondDisplay = second;
      let minute = duration.minutes();
      let minuteDisplay = minute;
      let hour = duration.hours();
      let hourDisplay = hour;
      if (second < 10) {
        secondDisplay = `0${second}`;
      }
      if (minute < 10) {
        minuteDisplay = `0${minute}`;
      }
      if (hour < 10) {
        hourDisplay = `0${hour}`;
      }

      setSeconds(secondDisplay);
      setMinutes(minuteDisplay);
      setHours(hourDisplay);
      if (second <= 0 && minute <= 0 && hour <= 0) {
        setSeconds(0);
        setMinutes(0);
        setHours(0);
        setIsTimeEnd(true);
        clearInterval(result);
      }
    }, 1);
  };

  useEffect(() => {
    if (order?.action?.expiry) {
      const now = moment().unix();
      const expired = moment(order?.action?.expiry).unix();
      if (now > expired) {
        return setIsTimeEnd(true);
      }
      countdownStart(order.action.expiry);
    } else {
      setIsTimeEnd(true);
    }
  }, [order]);

  return {
    seconds,
    minutes,
    hours,
    isTimeEnd,
    countdownStart,
  };
};

export default useCountdownV2;
