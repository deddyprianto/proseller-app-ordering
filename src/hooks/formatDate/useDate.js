import moment from 'moment';

const useDate = () => {
  const convertOrderActionDate = selectedDate => {
    if (selectedDate) {
      const joinDateTime = `${selectedDate}`;
      const newFormatDate = moment(joinDateTime).format('YYYY-MM-DD');
      return newFormatDate;
    }
    return new Date();
  };
  return {convertOrderActionDate};
};

export default useDate;
