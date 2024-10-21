import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { showNotification } from './notificationReducer'

const initUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  if (loggedUserJSON) {
    const loggedUser = JSON.parse(loggedUserJSON)
    blogService.setToken(loggedUser.token)
    return loggedUser
  }
  return null
}

const initialState = initUser()

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    deleteUser() {
      return null
    },
  },
})

export const { setUser, deleteUser } = userSlice.actions

export const logoutUser = user => {
  return dispatch => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(deleteUser())
    blogService.setToken(null)
    dispatch(
      showNotification([`Goodbye ${user.name} come back soon.`, 'good'], 5),
    )
  }
}

export const loggerUser = userObj => {
  return async dispatch => {
    try {
      const userLog = await loginService.login(userObj)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userLog))
      dispatch(setUser(userLog))
      blogService.setToken(userLog.token)
      dispatch(
        showNotification(
          [`Hi ${userLog.name}, Welcome to blog application!`, 'good'],
          5,
        ),
      )
    } catch {
      console.log('Wrong credentials')
      dispatch(showNotification(['Wrong username or password', 'error'], 5))
    }
  }
}

export default userSlice.reducer
