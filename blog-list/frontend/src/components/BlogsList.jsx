import { useSelector } from 'react-redux'
import Blog from './Blog'

const BlogsList = ({ user }) => {
  const blogs = useSelector(state => state.blogs)

  const addLike = () => {
    console.log('addLike')
  }
  const deleteBlog = () => {
    console.log('deleteBlog')
  }
  return (
    <div>
      <h2>redux list</h2>
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} user={user} />
      ))}
      {blogs.length === 0 && <h3>Here will be shown the added blogs</h3>}
    </div>
  )
}

export default BlogsList
