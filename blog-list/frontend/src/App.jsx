import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlog } from './reducers/blogReducer'
import { logoutUser } from './reducers/userReducer'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogsList from './components/BlogsList'
import './style.css'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlog())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logoutUser(user))
  }

  const refCreateBlog = useRef()

  if (user === null) {
    return (
      <div>
        <h1>Log in to application</h1>
        <Notification />
        <LoginForm />
      </div>
    )
  }
  return (
    <div>
      <h2>Blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>Logout</button>
      </p>
      <Notification />
      <Togglable buttonLabel='New blog' ref={refCreateBlog}>
        <BlogForm toggleRef={refCreateBlog} />
      </Togglable>
      <BlogsList user={user} />
    </div>
  )
}

export default App
