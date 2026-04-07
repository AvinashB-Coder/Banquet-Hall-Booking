'use client'

import { useState, useEffect } from 'react'

interface Booking {
  id: string
  eventDate: string
  endDate: string
  eventType: string
  customer: {
    firstName: string
    lastName: string
  }
  hall: {
    name: string
  }
  status: string
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty days for padding
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return bookings.filter((booking) => {
      const eventDate = new Date(booking.eventDate).toISOString().split('T')[0]
      return eventDate === dateStr
    })
  }

  const getBookingsForSelectedDate = () => {
    if (!selectedDate) return []
    return bookings.filter((booking) => {
      const eventDate = new Date(booking.eventDate).toISOString().split('T')[0]
      return eventDate === selectedDate
    })
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500'
      case 'PLANNING':
        return 'bg-indigo-500'
      case 'IN_PROGRESS':
        return 'bg-orange-500'
      case 'COMPLETED':
        return 'bg-teal-500'
      case 'CANCELLED':
        return 'bg-red-500'
      default:
        return 'bg-blue-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  const days = getDaysInMonth(currentDate)
  const selectedDateBookings = getBookingsForSelectedDate()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">Calendar</h2>
        <p className="text-secondary-600 mt-1">
          View bookings in calendar format
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="btn-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-xl font-bold text-secondary-900">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={nextMonth} className="btn-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-secondary-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-24"></div>
              }

              const dateBookings = getBookingsForDate(day)
              const isSelected = selectedDate === formatDate(day)
              const isToday = formatDate(day) === formatDate(new Date())

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(formatDate(day))}
                  className={`h-24 p-2 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-primary-300'
                  } ${isToday ? 'bg-secondary-50' : ''}`}
                >
                  <div className="text-sm font-medium mb-1">{day.getDate()}</div>
                  <div className="space-y-1">
                    {dateBookings.slice(0, 2).map((booking) => (
                      <div
                        key={booking.id}
                        className={`text-xs px-1 py-0.5 rounded text-white truncate ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.customer.firstName} - {booking.hall.name}
                      </div>
                    ))}
                    {dateBookings.length > 2 && (
                      <div className="text-xs text-secondary-500">+{dateBookings.length - 2} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Date Bookings */}
        <div className="card">
          <h3 className="text-lg font-bold text-secondary-900 mb-4">
            {selectedDate
              ? `Bookings for ${new Date(selectedDate).toLocaleDateString()}`
              : 'Select a date'}
          </h3>

          {selectedDateBookings.length === 0 ? (
            <p className="text-secondary-500 text-center py-8">No bookings for this date</p>
          ) : (
            <div className="space-y-4">
              {selectedDateBookings.map((booking) => (
                <div key={booking.id} className="p-4 border border-secondary-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-secondary-900">
                      {booking.customer.firstName} {booking.customer.lastName}
                    </h4>
                    <span className={`badge ${getStatusColor(booking.status)} text-white`}>
                      {booking.status}
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {booking.eventType}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
