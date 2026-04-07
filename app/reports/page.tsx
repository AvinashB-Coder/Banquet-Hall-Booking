'use client'

import { useState, useEffect } from 'react'

interface ReportData {
  totalRevenue: number
  totalBookings: number
  totalCustomers: number
  averageBookingValue: number
  revenueByEventType: { eventType: string; total: number; count: number }[]
  bookingsByStatus: { status: string; count: number }[]
  topHalls: { hallName: string; bookings: number; revenue: number }[]
  monthlyRevenue: { month: string; revenue: number }[]
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('year')

  useEffect(() => {
    fetchReportData()
  }, [dateRange])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reports?range=${dateRange}`)
      const data = await response.json()
      setReportData(data)
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-red-600">Failed to load report data</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Reports & Analytics</h2>
          <p className="text-secondary-600 mt-1">
            Comprehensive business insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <p className="text-sm text-secondary-600 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-primary-600">
            ${reportData.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-secondary-600 mb-1">Total Bookings</p>
          <p className="text-3xl font-bold text-secondary-900">{reportData.totalBookings}</p>
        </div>
        <div className="card">
          <p className="text-sm text-secondary-600 mb-1">Total Customers</p>
          <p className="text-3xl font-bold text-secondary-900">{reportData.totalCustomers}</p>
        </div>
        <div className="card">
          <p className="text-sm text-secondary-600 mb-1">Avg Booking Value</p>
          <p className="text-3xl font-bold text-secondary-900">
            ${reportData.averageBookingValue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Revenue by Event Type */}
      <div className="card">
        <h3 className="text-lg font-bold text-secondary-900 mb-4">Revenue by Event Type</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">
                  Event Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {reportData.revenueByEventType.map((item) => (
                <tr key={item.eventType} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-secondary-900">
                    {item.eventType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-secondary-700">
                    {item.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-secondary-700">
                    ${item.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-secondary-700">
                    {reportData.totalRevenue > 0
                      ? ((item.total / reportData.totalRevenue) * 100).toFixed(1)
                      : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bookings by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-secondary-900 mb-4">Bookings by Status</h3>
          <div className="space-y-3">
            {reportData.bookingsByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-secondary-700">{item.status}</span>
                <div className="flex items-center gap-3">
                  <div className="w-48 bg-secondary-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{
                        width: `${(item.count / reportData.totalBookings) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-secondary-900 w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Halls */}
        <div className="card">
          <h3 className="text-lg font-bold text-secondary-900 mb-4">Top Performing Halls</h3>
          <div className="space-y-4">
            {reportData.topHalls.map((hall) => (
              <div key={hall.hallName} className="p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-secondary-900">{hall.hallName}</h4>
                  <span className="badge badge-info">{hall.bookings} bookings</span>
                </div>
                <p className="text-sm text-secondary-600">
                  Revenue: <span className="font-medium text-primary-600">${hall.revenue.toLocaleString()}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Revenue Trend */}
      <div className="card">
        <h3 className="text-lg font-bold text-secondary-900 mb-4">Monthly Revenue Trend</h3>
        <div className="space-y-3">
          {reportData.monthlyRevenue.map((item) => (
            <div key={item.month} className="flex items-center gap-4">
              <div className="w-20 text-sm text-secondary-700">{item.month}</div>
              <div className="flex-1">
                <div className="bg-secondary-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all"
                    style={{
                      width: `${reportData.monthlyRevenue.length > 0
                        ? (item.revenue / Math.max(...reportData.monthlyRevenue.map((m) => m.revenue))) * 100
                        : 0}%`
                    }}
                  ></div>
                </div>
              </div>
              <div className="w-24 text-sm font-medium text-secondary-900 text-right">
                ${item.revenue.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
