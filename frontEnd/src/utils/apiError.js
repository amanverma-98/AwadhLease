export function getApiErrorMessage(error) {
  const data = error?.response?.data
  if (data?.error?.message) return data.error.message
  if (typeof data?.detail === 'string') return data.detail
  if (error?.message) return error.message
  return 'Something went wrong. Please try again.'
}
