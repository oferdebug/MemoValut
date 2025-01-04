/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaEdit, FaTrash } from 'react-icons/fa'

const Dashboard = () => {
  const [memos, setMemos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMemo, setSelectedMemo] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  })

  useEffect(() => {
    fetchMemos()
  }, [])

  const fetchMemos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/memos`, {
        withCredentials: true,
      })
      setMemos(response.data)
     
    } catch (error) {
      toast.error('Failed to fetch memos')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (selectedMemo) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/v1/memos/${selectedMemo._id}`,
          formData,
          { withCredentials: true }
        )
        toast.success('Memo updated successfully')
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/memos`,
          formData,
          { withCredentials: true }
        )
        toast.success('Memo created successfully')
      }
      fetchMemos()
      handleClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (memo) => {
    setSelectedMemo(memo)
    setFormData({
      title: memo.title,
      content: memo.content,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this memo?')) return

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/memos/${id}`, {
        withCredentials: true,
      })
      toast.success('Memo deleted successfully')
      fetchMemos()
    } catch (error) {
      toast.error('Failed to delete memo')
    }
  }

  const handleClose = () => {
    setSelectedMemo(null)
    setFormData({ title: '', content: '' })
    setIsOpen(false)
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="heading">My Memos</h1>
        <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
          Create New Memo
        </button>
      </div>

      <div className="grid">
        {memos.map((memo) => (
          <div key={memo._id} className="card">
            <div className="memo-header">
              <h2 className="heading">{memo.title}</h2>
              <div className="memo-actions">
                <button
                  className="btn btn-ghost"
                  onClick={() => handleEdit(memo)}
                  aria-label="Edit memo"
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleDelete(memo._id)}
                  aria-label="Delete memo"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <p>{memo.content}</p>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={handleClose}>
              ✕
            </button>
            <h2 className="heading">
              {selectedMemo ? 'Edit Memo' : 'Create New Memo'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  name="content"
                  className="form-control"
                  value={formData.content}
                  onChange={handleChange}
                  style={{ height: '150px' }}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {selectedMemo ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard;