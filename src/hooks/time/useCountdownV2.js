/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import React, {useState, useEffect} from 'react';

const useCountdownV2 = order => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isTimeEnd, setIsTimeEnd] = useState(false);

  const countdownStart = orderData => {
    const then = moment(orderData.action.expiry).format('MM/DD/YYYY HH:mm:ss');

    const result = setInterval(() => {
      const now = moment().format('MM/DD/YYYY HH:mm:ss');
      const ms = moment(then).diff(moment(now));

      const duration = moment.duration(ms);
      let second = duration.seconds();
      let minute = duration.minutes();
      let hour = duration.hours();
      if (second < 10) {
        second = `0${second}`;
      }
      if (minute < 10) {
        minute = `0${minute}`;
      }

      setSeconds(second);
      setMinutes(minute);
      setHours(hour);

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
    if (order) {
      countdownStart(order);
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
