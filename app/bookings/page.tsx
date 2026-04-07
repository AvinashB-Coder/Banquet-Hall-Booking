'use client'

import { useState, useEffect } from 'react'

interface Booking {
  id: string
  eventDate: string
  endDate: string
  eventType: string
  guestCount: number
  status: string
  totalPrice: number
  advancePaid: number
  notes?: string
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  hall: {
    id: string
    name: string
  }
  package?: {
    id: string
    name: string
  } | null
}

const COLUMNS = [
  { id: 'INQUIRY', title: 'Inquiry', color: 'bg-blue-500' },
  { id: 'PROPOSAL_SENT', title: 'Proposal Sent', color: 'bg-purple-500' },
  { id: 'NEGOTIATION', title: 'Negotiation', color: 'bg-yellow-500' },
  { id: 'CONFIRMED', title: 'Confirmed', color: 'bg-green-500' },
  { id: 'PLANNING', title: 'Planning', color: 'bg-indigo-500' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-orange-500' },
  { id: 'COMPLETED', title: 'Completed', color: 'bg-teal-500' }
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [draggedBooking, setDraggedBooking] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bookings')
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (bookingId: string) => {
    setDraggedBooking(bookingId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (status: string) => {
    if (!draggedBooking) return

    try {
      const response = await fetch(`/api/bookings/${draggedBooking}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
    } finally {
      setDraggedBooking(null)
    }
  }

  const getBookingsByStatus = (status: string) => {
    return bookings.filter((booking) => booking.status === status)
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
          <h2 className="text-2xl font-bold text-secondary-900">Bookings</h2>
          <p className="text-secondary-600 mt-1">
            Manage bookings through the pipeline
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Booking
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div className="bg-secondary-100 rounded-lg p-4 h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                <h3 className="font-semibold text-secondary-900">{column.title}</h3>
                <span className="ml-auto bg-white px-2 py-1 rounded text-sm font-medium">
                  {getBookingsByStatus(column.id).length}
                </span>
              </div>

              <div className="space-y-3">
                {getBookingsByStatus(column.id).map((booking) => (
                  <div
                    key={booking.id}
                    draggable
                    onDragStart={() => handleDragStart(booking.id)}
                    className="bg-white rounded-lg p-4 shadow-sm cursor-move hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-secondary-900">
                        {booking.customer.firstName} {booking.customer.lastName}
                      </h4>
                      <span className="text-xs text-secondary-500">
                        ${booking.totalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-secondary-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(booking.eventDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {booking.hall.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {booking.guestCount} guests
                      </div>
                    </div>

                    <div className="mt-2">
                      <span className="inline-block bg-secondary-100 text-secondary-700 text-xs px-2 py-1 rounded">
                        {booking.eventType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
