import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, price, features, hallId, isActive } = body

    if (!name || !price || !hallId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const package_ = await prisma.package.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        features: features || null,
        hallId,
        isActive: isActive !== false
      }
    })

    return NextResponse.json(package_, { status: 201 })
  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 }
    )
  }
}
