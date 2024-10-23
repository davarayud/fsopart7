import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

export const setToken = newToken => (token = `Bearer ${newToken}`)

export const getBlogs = () => axios.get(baseUrl).then(res => res.data)

export const createBlog = newBlog => {
  const config = {
    headers: { Authorization: token },
  }
  return axios.post(baseUrl, newBlog, config).then(res => res.data)
}

export const updateBlog = updatedBlog =>
  axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog).then(res => res.data)

export const deleteBlog = id => {
  const config = {
    headers: { Authorization: token },
  }
  return axios.delete(`${baseUrl}/${id}`, config).then(res => res.data)
}
