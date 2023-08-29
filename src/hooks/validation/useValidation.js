const useValidation = () => {
  const isValidEmail = email => {
    const regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return regexp.test(email);
  };

  return {
    isValidEmail,
  };
};

export default useValidation;
