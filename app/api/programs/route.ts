import { type NextRequest, NextResponse } from "next/server"

// Mock database
const programs = [
  {
    id: 1,
    title: "Pelatihan Digital Marketing untuk UMKM",
    description: "Program pelatihan komprehensif untuk meningkatkan kemampuan digital marketing UMKM",
    organizer: "Kementerian Koperasi dan UKM",
    category: "Digital Marketing",
    type: "Pelatihan",
    status: "Pendaftaran Dibuka",
    startDate: "2025-01-15T00:00:00Z",
    endDate: "2025-01-17T00:00:00Z",
    duration: "3 hari",
    participants: 50,
    registered: 32,
    location: "Jakarta",
    mode: "Hybrid",
    price: "Gratis",
    benefits: ["Sertifikat resmi", "Modul digital", "Konsultasi gratis"],
    requirements: ["UMKM aktif", "Laptop/smartphone", "Komitmen full program"],
    image: "/placeholder.svg?height=200&width=300",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// GET /api/programs - Get all programs with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const organizer = searchParams.get("organizer")

    let filteredPrograms = [...programs]

    // Apply search filter
    if (search) {
      filteredPrograms = filteredPrograms.filter(
        (program) =>
          program.title.toLowerCase().includes(search.toLowerCase()) ||
          program.organizer.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Apply category filter
    if (category && category !== "all") {
      filteredPrograms = filteredPrograms.filter((program) => program.category.toLowerCase() === category.toLowerCase())
    }

    // Apply status filter
    if (status && status !== "all") {
      filteredPrograms = filteredPrograms.filter((program) => program.status === status)
    }

    // Apply organizer filter
    if (organizer) {
      filteredPrograms = filteredPrograms.filter((program) =>
        program.organizer.toLowerCase().includes(organizer.toLowerCase()),
      )
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPrograms = filteredPrograms.slice(startIndex, endIndex)

    const response = {
      programs: paginatedPrograms,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredPrograms.length / limit),
        totalItems: filteredPrograms.length,
        hasNext: endIndex < filteredPrograms.length,
        hasPrev: page > 1,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 })
  }
}

// POST /api/programs - Create new program (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["title", "description", "organizer", "category", "startDate", "endDate"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Create new program
    const newProgram = {
      id: programs.length + 1,
      ...body,
      registered: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    programs.push(newProgram)

    return NextResponse.json(newProgram, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create program" }, { status: 500 })
  }
}
