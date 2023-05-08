const useErrorMessage = () => {
  const outletUnavailable = currentOutlet => {
    let message = `${
      currentOutlet.name
    } is currently offline, please select another outlet`;
    const title = 'The outlet is offline';
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
