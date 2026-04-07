import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || 'year'

    const now = new Date()
    let startDate: Date

    switch (range) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3)
        startDate = new Date(now.getFullYear(), quarter * 3, 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case 'all':
        startDate = new Date(0)
        break
      default:
        startDate = new Date(now.getFullYear(), 0, 1)
    }

    // Get all bookings in date range
    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        customer: true,
        hall: true
      }
    })

    // Calculate metrics
    const totalRevenue = bookings
      .filter((b) => b.status !== 'CANCELLED')
      .reduce((sum, b) => sum + b.totalPrice, 0)

    const totalBookings = bookings.length
    const totalCustomers = await prisma.customer.count()
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

    // Revenue by event type
    const revenueByEventTypeMap = new Map()
    bookings
      .filter((b) => b.status !== 'CANCELLED')
      .forEach((booking) => {
        const existing = revenueByEventTypeMap.get(booking.eventType) || { total: 0, count: 0 }
        revenueByEventTypeMap.set(booking.eventType, {
          total: existing.total + booking.totalPrice,
          count: existing.count + 1
        })
      })

    const revenueByEventType = Array.from(revenueByEventTypeMap.entries()).map(
      ([eventType, data]) => ({
        eventType,
        total: (data as any).total,
        count: (data as any).count
      })
    )

    // Bookings by status
    const bookingsByStatusMap = new Map()
    bookings.forEach((booking) => {
      const count = bookingsByStatusMap.get(booking.status) || 0
      bookingsByStatusMap.set(booking.status, count + 1)
    })

    const bookingsByStatus = Array.from(bookingsByStatusMap.entries()).map(([status, count]) => ({
      status,
      count
    }))

    // Top halls
    const hallsMap = new Map()
    bookings
      .filter((b) => b.status !== 'CANCELLED')
      .forEach((booking) => {
        const existing = hallsMap.get(booking.hallId) || {
          hallName: booking.hall.name,
          bookings: 0,
          revenue: 0
        }
        hallsMap.set(booking.hallId, {
          ...existing,
          bookings: existing.bookings + 1,
          revenue: existing.revenue + booking.totalPrice
        })
      })

    const topHalls = Array.from(hallsMap.values())
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5)

    // Monthly revenue
    const monthlyRevenueMap = new Map()
    bookings
      .filter((b) => b.status !== 'CANCELLED')
      .forEach((booking) => {
        const month = new Date(booking.createdAt).toLocaleString('default', {
          month: 'short',
          year: 'numeric'
        })
        const existing = monthlyRevenueMap.get(month) || 0
        monthlyRevenueMap.set(month, existing + booking.totalPrice)
      })

    const monthlyRevenue = Array.from(monthlyRevenueMap.entries()).map(([month, revenue]) => ({
      month,
      revenue
    }))

    return NextResponse.json({
      totalRevenue,
      totalBookings,
      totalCustomers,
      averageBookingValue,
      revenueByEventType,
      bookingsByStatus,
      topHalls,
      monthlyRevenue
    })
  } catch (error) {
    console.error('Error fetching report data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report data' },
      { status: 500 }
    )
  }
}
