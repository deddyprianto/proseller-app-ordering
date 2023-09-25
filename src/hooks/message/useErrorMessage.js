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
  const outletClosed = currentOutlet => {
    const title = 'Outside Operational Hours';

    let message = `${
      currentOutlet.name
    } is currently outside its operational hours. Please select another outlet.`;

    return {
      title,
      message,
    };
  };
  return {
    outletUnavailable,
    outletClosed,
  };
};

export default useErrorMessage;
