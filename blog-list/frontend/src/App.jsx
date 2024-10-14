import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import './style.css'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import { showNotification } from './reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notifMessage, setNotifMessege] = useState([null, ''])
  const dispatch = useDispatch()

  useEffect(() => {
    const setingBlog = async () => {
      const blogsInDB = await blogService.getAll()
      const orderBlogs = blogsInDB.sort((a, b) => (a.likes > b.likes ? -1 : 1))
      setBlogs(orderBlogs)
    }
    setingBlog()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const logger = async userObj => {
    try {
      const userLog = await loginService.login(userObj)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userLog))
      setUser(userLog)
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

  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(
      showNotification([`Goodbye ${user.name} come back soon.`, 'good'], 5),
    )
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async objectBlog => {
    try {
      const response = await blogService.createBlog(objectBlog)
      setBlogs(blogs.concat(response))
      refCreateBlog.current.toggleVisibility()
      dispatch(
        showNotification(
          [`A new blog ${response.title} by ${response.author} added.`, 'good'],
          5,
        ),
      )
    } catch (error) {
      console.log(error)
    }
  }

  const addLike = async blog => {
    const blogToUp = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    try {
      const response = await blogService.update(blog.id, blogToUp)
      const blogAdded = blogs.map(blogInList =>
        blogInList.id !== blog.id ? blogInList : response,
      )
      const orderBlogs = blogAdded.sort((a, b) => (a.likes > b.likes ? -1 : 1))
      setBlogs(orderBlogs)
      dispatch(
        showNotification(
          [`You liked '${response.title}' by '${response.author}'`, 'good'],
          5,
        ),
      )
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBlog = async blogToDelete => {
    if (
      window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`,
      )
    ) {
      await blogService.deleteBlog(blogToDelete.id)
      setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
      dispatch(
        showNotification(
          [`The blog ${blogToDelete.title} has been delete`, 'good'],
          5,
        ),
      )
    }
  }

  const refCreateBlog = useRef()

  if (user === null) {
    return (
      <div>
        <h1>Log in to application</h1>
        <Notification />
        <LoginForm logger={logger}></LoginForm>
      </div>
    )
  }
  return (
    <div>
      <h2>Blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>Logout</button>{' '}
      </p>
      <Notification notifObjet={notifMessage} />
      <Togglable buttonLabel='New blog' ref={refCreateBlog}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          addLike={addLike}
          deleteBlog={deleteBlog}
        />
      ))}
      {blogs.length === 0 && <h3>Here will be shown the added blogs</h3>}
    </div>
  )
}

export default App
