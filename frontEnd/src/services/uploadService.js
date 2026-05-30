import apiClient from '../api/client'

/**
 * @param {File} file
 * @returns {Promise<import('../api/types').UploadResponse>}
 */
export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post('/uploads', formData)
  return data
}
