import { useEffect, useRef, useContext } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import './style.css'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import { useNotificationDispatch } from './NotificationContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createBlog,
  deleteBlog,
  getBlogs,
  setToken,
  updateBlog,
} from './request'
import UserContext, { deleteUser, setiUser } from './UserContext'

const App = () => {
  const queryClient = useQueryClient()
  const [user, userDispatch] = useContext(UserContext)
  const notifDispatch = useNotificationDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      userDispatch(setiUser(loggedUser))
      setToken(loggedUser.token)
    }
  }, [userDispatch])

  const refCreateBlog = useRef()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
  })
  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: objectBlog => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      refCreateBlog.current.toggleVisibility()
      setNotifObjet([
        `A new blog ${objectBlog.title} by ${objectBlog.author} added.`,
        'good',
      ])
    },
  })
  const updateBlogMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: blogToDelete => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      setNotifObjet([`The blog ${blogToDelete.title} has been delete`, 'good'])
    },
  })

  if (result.isLoading) {
    return <div> loading data... </div>
  }

  const blogs2 = result.data.sort((a, b) => (a.likes > b.likes ? -1 : 1))

  const setNotifObjet = notif => {
    notifDispatch({
      type: 'SET',
      payload: notif,
    })
    setTimeout(() => {
      notifDispatch({ type: 'DELETE' })
    }, 5000)
  }

  const logger = async userObj => {
    try {
      const userLog = await loginService.login(userObj)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userLog))
      userDispatch(setiUser(userLog))
      setToken(userLog.token)
      setNotifObjet([
        `Hi ${userLog.name}, Welcome to blog application!`,
        'good',
      ])
    } catch {
      console.log('Wrong credentials')
      setNotifObjet(['Wrong username or password', 'error'])
    }
  }

  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setNotifObjet([`Goodbye ${user.name} come back soon.`, 'good'])
    userDispatch(deleteUser())
    setToken(null)
  }

  const addBlog = async objectBlog => {
    newBlogMutation.mutate(objectBlog)
  }

  const addLike = async blog => {
    const blogToUp = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    }
    updateBlogMutation.mutate(blogToUp)
  }

  const deleteBlogFn = async blogToDelete => {
    if (
      window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`,
      )
    ) {
      deleteBlogMutation.mutate(blogToDelete.id)
    }
  }

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
      <Notification />
      <Togglable buttonLabel='New blog' ref={refCreateBlog}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      {blogs2.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          addLike={addLike}
          deleteBlog={deleteBlogFn}
        />
      ))}
      {blogs2.length === 0 && <h3>Here will be shown the added blogs</h3>}
    </div>
  )
}

export default App
