/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from 'react';
// Our hook
export default function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [countdownInterval, setCountdownInterval] = useState(0);

  const countdown = async () => {
    let second = 1;
    const result = setInterval(() => {
      second = second - 1;
      if (second === 0) {
        clearInterval(result);
        setDebouncedValue(value);
      }
    }, delay);

    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    setCountdownInterval(result);
  };

  useEffect(() => {
    const loadData = async () => {
      await countdown();
    };

    loadData();
  }, [value, delay]);

  return debouncedValue;
}
