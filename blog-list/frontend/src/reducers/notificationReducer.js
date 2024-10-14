import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    deleteNotification() {
      return null
    },
  },
})

export const { setNotification, deleteNotification } = notificationSlice.actions

export const showNotification = (notification, timeout) => {
  return async dispatch => {
    dispatch(setNotification(notification))
    setTimeout(() => {
      dispatch(deleteNotification())
    }, timeout * 1000)
  }
}

export default notificationSlice.reducer
