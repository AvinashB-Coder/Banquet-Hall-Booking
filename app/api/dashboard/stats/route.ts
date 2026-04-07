import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    // Get total bookings
    const totalBookings = await prisma.booking.count()

    // Get active bookings (confirmed, planning, in progress)
    const activeBookings = await prisma.booking.count({
      where: {
        status: {
          in: ['CONFIRMED', 'PLANNING', 'IN_PROGRESS']
        }
      }
    })

    // Get total revenue this year
    const bookingsThisYear = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: startOfYear
        },
        status: {
          not: 'CANCELLED'
        }
      },
      select: {
        totalPrice: true
      }
    })

    const totalRevenue = bookingsThisYear.reduce((sum, b) => sum + b.totalPrice, 0)

    // Get upcoming events
    const upcomingEvents = await prisma.booking.count({
      where: {
        eventDate: {
          gte: now,
          lte: thirtyDaysFromNow
        },
        status: {
          in: ['CONFIRMED', 'PLANNING', 'IN_PROGRESS']
        }
      }
    })

    // Calculate occupancy rate (simplified)
    const totalHalls = await prisma.hall.count({
      where: {
        isActive: true
      }
    })
    
    const occupiedSlots = await prisma.booking.count({
      where: {
        eventDate: {
          gte: now,
          lte: thirtyDaysFromNow
        },
        status: {
          in: ['CONFIRMED', 'PLANNING', 'IN_PROGRESS']
        }
      }
    })

    const occupancyRate = totalHalls > 0 ? Math.round((occupiedSlots / (totalHalls * 30)) * 100) : 0

    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        customer: true,
        hall: true
      }
    })

    return NextResponse.json({
      totalBookings,
      activeBookings,
      totalRevenue,
      upcomingEvents,
      occupancyRate,
      recentBookings
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
