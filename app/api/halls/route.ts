import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const halls = await prisma.hall.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        packages: true,
        _count: {
          select: { bookings: true }
        }
      }
    })

    return NextResponse.json(halls)
  } catch (error) {
    console.error('Error fetching halls:', error)
    return NextResponse.json(
      { error: 'Failed to fetch halls' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, capacity, size, pricePerDay, amenities, image, isActive } = body

    if (!name || !capacity || !pricePerDay) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const hall = await prisma.hall.create({
      data: {
        name,
        description: description || null,
        capacity: parseInt(capacity),
        size: size ? parseFloat(size) : null,
        pricePerDay: parseFloat(pricePerDay),
        amenities: amenities || null,
        image: image || null,
        isActive: isActive !== false
      }
    })

    return NextResponse.json(hall, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Hall with this name already exists' },
        { status: 409 }
      )
    }
    console.error('Error creating hall:', error)
    return NextResponse.json(
      { error: 'Failed to create hall' },
      { status: 500 }
    )
  }
}
