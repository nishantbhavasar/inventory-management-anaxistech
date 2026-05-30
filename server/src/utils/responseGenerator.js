export default function sendResponse({
  res,
  statusCode,
  message,
  data,
  success,
}) {
  return res.status(statusCode).json({
    success: success ?? (statusCode === 200 || statusCode < 300),
    message,
    data,
  });
}
