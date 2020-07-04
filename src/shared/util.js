export const returnError = (res, code, message) => {
  return res.status(code).json({
    errors: {
      message
    },
    success: false
  });
};
