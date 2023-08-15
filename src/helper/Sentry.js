export const reportSentry = (url, body, error) => {
  const errorData = {
    url,
    body,
    error: {
      code: error.response.resultCode,
      message: error.response.message,
    },
  };
  return JSON.stringify(errorData);
};
