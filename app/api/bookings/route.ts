import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status ? { status } : {}

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        customer: true,
        hall: true,
        package: true
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      customerId,
      hallId,
      packageId,
      eventDate,
      endDate,
      eventType,
      guestCount,
      status,
      totalPrice,
      advancePaid,
      notes,
      requirements,
      assignedTo
    } = body

    if (!customerId || !hallId || !eventDate || !endDate || !eventType || !guestCount || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        customerId,
        hallId,
        packageId: packageId || null,
        eventDate: new Date(eventDate),
        endDate: new Date(endDate),
        eventType,
        guestCount,
        status: status || 'INQUIRY',
        totalPrice,
        advancePaid: advancePaid || 0,
        notes: notes || null,
        requirements: requirements || null,
        assignedTo: assignedTo || null
      },
      include: {
        customer: true,
        hall: true,
        package: true
      }
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
