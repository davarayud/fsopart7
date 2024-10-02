const Notification = ({ notif }) => {
  if (!notif) {
    return null
  }

  const notifStyle = {
    border: 'solid',
    borderColor: 'grey',
    padding: 10,
    borderWidth: 3,
    marginBottom: 20,
    width: '50%',
  }

  return <div style={notifStyle}>{notif}</div>
}

export default Notification
