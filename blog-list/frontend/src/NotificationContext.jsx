import { createContext, useContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET': {
      console.log(action)
      return action.payload
    }
    case 'DELETE':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = props => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null,
  )

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notifAndDispatch = useContext(NotificationContext)
  return notifAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notifAndDispatch = useContext(NotificationContext)
  return notifAndDispatch[1]
}

export default NotificationContext
