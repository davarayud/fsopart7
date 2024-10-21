import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { showNotification } from './notificationReducer'

const initialState = []

const sortBlogs = blogs => blogs.sort((a, b) => (a.likes > b.likes ? -1 : 1))

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    set(state, action) {
      return action.payload
    },
    append(state, action) {
      return state.concat(action.payload)
    },
    upload(state, action) {
      const id = action.payload.id
      const changedBlog = action.payload
      const changedBlogList = state.map(blog =>
        blog.id === id ? changedBlog : blog,
      )
      return sortBlogs(changedBlogList)
    },
    eliminate(state, action) {
      const id = action.payload.id
      return state.filter(blog => blog.id !== id)
    },
  },
})

export const { set, append, upload, eliminate } = blogSlice.actions

export const initializeBlog = () => {
  return async dispatch => {
    const blogsInDB = await blogService.getAll()
    const orderBlogs = sortBlogs(blogsInDB)
    dispatch(set(orderBlogs))
  }
}

export const createBlog = blog => {
  return async dispatch => {
    try {
      const newBlog = await blogService.createBlog(blog)
      dispatch(append(newBlog))
      dispatch(
        showNotification(
          [`A new blog ${newBlog.title} by ${newBlog.author} added.`, 'good'],
          5,
        ),
      )
    } catch (error) {
      console.log(error)
    }
  }
}

export const likeBlog = blog => {
  return async dispatch => {
    const blogToUp = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    const changedBlog = await blogService.update(blog.id, blogToUp)
    dispatch(upload(changedBlog))
    dispatch(
      showNotification(
        [`You liked '${blog.title}' by '${blog.author}'`, 'good'],
        5,
      ),
    )
  }
}

export const eliminateBlog = blogToDelete => {
  return async dispatch => {
    await blogService.deleteBlog(blogToDelete.id)
    dispatch(eliminate(blogToDelete))
    dispatch(
      showNotification(
        [`The blog ${blogToDelete.title} has been delete`, 'good'],
        5,
      ),
    )
  }
}

export default blogSlice.reducer
