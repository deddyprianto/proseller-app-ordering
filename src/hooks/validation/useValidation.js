const useValidation = () => {
  const isValidEmail = email => {
    const regexp = /^[\w][\w-+\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return regexp.test(email);
  };

  return {
    isValidEmail,
  };
};

export default useValidation;
