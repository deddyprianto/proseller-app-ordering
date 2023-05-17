const useErrorMessage = () => {
  const outletUnavailable = currentOutlet => {
    let message = `${
      currentOutlet.name
    } is currently not available, please select another outlet`;
    const title = 'The outlet is not available';
    if (currentOutlet?.offlineMessage) {
      message = currentOutlet?.offlineMessage;
    }
    return {
      message,
      title,
    };
  };

  return {
    outletUnavailable,
  };
};

export default useErrorMessage;
