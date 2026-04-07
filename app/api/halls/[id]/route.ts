import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const hall = await prisma.hall.findUnique({
      where: { id: params.id },
      include: {
        packages: true,
        _count: {
          select: { bookings: true }
        }
      }
    })

    if (!hall) {
      return NextResponse.json(
        { error: 'Hall not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(hall)
  } catch (error) {
    console.error('Error fetching hall:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hall' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const hall = await prisma.hall.update({
      where: { id: params.id },
      data: {
        ...body,
        capacity: body.capacity ? parseInt(body.capacity) : undefined,
        size: body.size ? parseFloat(body.size) : undefined,
        pricePerDay: body.pricePerDay ? parseFloat(body.pricePerDay) : undefined
      }
    })

    return NextResponse.json(hall)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Hall not found' },
        { status: 404 }
      )
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Hall with this name already exists' },
        { status: 409 }
      )
    }
    console.error('Error updating hall:', error)
    return NextResponse.json(
      { error: 'Failed to update hall' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.hall.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Hall not found' },
        { status: 404 }
      )
    }
    console.error('Error deleting hall:', error)
    return NextResponse.json(
      { error: 'Failed to delete hall' },
      { status: 500 }
    )
  }
}
