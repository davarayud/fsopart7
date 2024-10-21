import { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { eliminateBlog, likeBlog } from '../reducers/blogReducer'

const Blog = ({ blog, user }) => {
  const [view, setView] = useState(false)

  const showDelete = {
    display: user.username === blog.user.username ? '' : 'none',
  }

  const dispatch = useDispatch()

  const addLike = blog => {
    dispatch(likeBlog(blog))
  }

  const deleteBlog = blogToDelete => {
    if (
      window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`,
      )
    ) {
      dispatch(eliminateBlog(blogToDelete))
    }
  }

  return (
    <div className='blog'>
      <div className='short-info'>
        <span>
          {blog.title} {blog.author}{' '}
        </span>
        {!view && <button onClick={() => setView(true)}>view</button>}
        {view && <button onClick={() => setView(false)}>hide</button>}
        {view && (
          <>
            <br />
            {blog.url}
            <br />
            Likes: {blog.likes}{' '}
            <button onClick={() => addLike(blog)}>like</button>
            <br />
            {blog.user.name}
            <br />
            <div style={showDelete} className='delete'>
              <button onClick={() => deleteBlog(blog)}>delete</button>
            </div>{' '}
          </>
        )}
      </div>
    </div>
  )
}

Blog.prototype = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog
