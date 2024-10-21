import { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'

const BlogForm = ({ toggleRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()

  const handleTitle = event => setTitle(event.target.value)
  const handleAuthor = event => setAuthor(event.target.value)
  const handleUrl = event => setUrl(event.target.value)

  const handleAddBlog = event => {
    event.preventDefault()
    const objectBlog = {
      title,
      author,
      url,
    }
    dispatch(createBlog(objectBlog))
    toggleRef.current.toggleVisibility()
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={handleAddBlog}>
        <div>
          <label>
            Title:{' '}
            <input
              type='text'
              name='Title'
              value={title}
              onChange={handleTitle}
              id='Title'
            />
          </label>
        </div>
        <div>
          <label>
            Author:{' '}
            <input
              type='text'
              name='Author'
              value={author}
              onChange={handleAuthor}
              id='Author'
            />
          </label>
        </div>
        <div>
          <label>
            URL:{' '}
            <input
              type='URL'
              name='Url'
              value={url}
              onChange={handleUrl}
              id='Url'
            />
          </label>
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
    </div>
  )
}

BlogForm.prototype = {
  toggleRef: PropTypes.object.isRequired,
}

export default BlogForm
