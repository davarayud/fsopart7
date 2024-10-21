import React, { useContext } from 'react'
import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if (notification === null) {
    return null
  }

  const [message, type] = notification
  return <div className={type}>{message}</div>
}

export default Notification
