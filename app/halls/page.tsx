'use client'

import { useState, useEffect } from 'react'

interface Hall {
  id: string
  name: string
  description?: string
  capacity: number
  size?: number
  pricePerDay: number
  amenities?: string
  image?: string
  isActive: boolean
  _count?: {
    bookings: number
  }
  packages?: Package[]
}

interface Package {
  id: string
  name: string
  description?: string
  price: number
  features?: string
  hallId: string
  isActive: boolean
}

export default function HallsPage() {
  const [halls, setHalls] = useState<Hall[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingHall, setEditingHall] = useState<Hall | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: '',
    size: '',
    pricePerDay: '',
    amenities: '',
    image: '',
    isActive: true
  })

  useEffect(() => {
    fetchHalls()
  }, [])

  const fetchHalls = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/halls')
      const data = await response.json()
      setHalls(data)
    } catch (error) {
      console.error('Error fetching halls:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddHall = () => {
    setEditingHall(null)
    setFormData({
      name: '',
      description: '',
      capacity: '',
      size: '',
      pricePerDay: '',
      amenities: '',
      image: '',
      isActive: true
    })
    setShowModal(true)
  }

  const handleEditHall = (hall: Hall) => {
    setEditingHall(hall)
    setFormData({
      name: hall.name,
      description: hall.description || '',
      capacity: hall.capacity.toString(),
      size: hall.size?.toString() || '',
      pricePerDay: hall.pricePerDay.toString(),
      amenities: hall.amenities || '',
      image: hall.image || '',
      isActive: hall.isActive
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingHall
        ? `/api/halls/${editingHall.id}`
        : '/api/halls'
      
      const method = editingHall ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowModal(false)
        fetchHalls()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save hall')
      }
    } catch (error) {
      console.error('Error saving hall:', error)
      alert('Failed to save hall')
    }
  }

  const handleDeleteHall = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hall?')) {
      return
    }

    try {
      const response = await fetch(`/api/halls/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchHalls()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete hall')
      }
    } catch (error) {
      console.error('Error deleting hall:', error)
      alert('Failed to delete hall')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Halls</h2>
          <p className="text-secondary-600 mt-1">
            Manage your banquet halls and venues
          </p>
        </div>
        <button onClick={handleAddHall} className="btn-primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Hall
        </button>
      </div>

      {/* Halls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halls.map((hall) => (
          <div key={hall.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-secondary-900">{hall.name}</h3>
              <span className={`badge ${hall.isActive ? 'badge-success' : 'badge-danger'}`}>
                {hall.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {hall.description && (
              <p className="text-sm text-secondary-600 mb-4">{hall.description}</p>
            )}

            <div className="space-y-2 text-sm text-secondary-700 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-secondary-500">Capacity:</span>
                <span className="font-medium">{hall.capacity} people</span>
              </div>
              {hall.size && (
                <div className="flex items-center justify-between">
                  <span className="text-secondary-500">Size:</span>
                  <span className="font-medium">{hall.size} sq ft</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-secondary-500">Price per day:</span>
                <span className="font-medium text-primary-600">${hall.pricePerDay.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-500">Bookings:</span>
                <span className="badge badge-info">{hall._count?.bookings || 0}</span>
              </div>
            </div>

            {hall.amenities && (
              <div className="mb-4">
                <p className="text-xs font-medium text-secondary-500 mb-2">Amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {hall.amenities.split(',').map((amenity, index) => (
                    <span key={index} className="badge badge-info">
                      {amenity.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleEditHall(hall)}
                className="btn-secondary flex-1"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteHall(hall.id)}
                className="btn-danger flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {halls.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-secondary-500">No halls found. Add your first hall to get started.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-secondary-900">
                {editingHall ? 'Edit Hall' : 'Add Hall'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Hall Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Size (sq ft)
                  </label>
                  <input
                    type="number"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Price per Day *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  className="input-field"
                  placeholder="Stage, Lighting, Sound System, AC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-secondary-700">
                  Active
                </label>
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingHall ? 'Update' : 'Create'} Hall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
