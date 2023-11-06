const useRegex = () => {
  const handleRemovePostalCode = (string = '') => {
    return string.replace(/\d{6}/, '');
  };

  return {
    handleRemovePostalCode,
  };
};

export default useRegex;
