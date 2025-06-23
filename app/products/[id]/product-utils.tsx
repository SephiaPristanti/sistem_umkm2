// Mock database function
export async function getProduct(id: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const products = [
    {
      id: "1",
      name: "Fudgy Brownies",
      business: "Sweet Bites",
      price: "Rp 120.000/box",
      originalPrice: "Rp 120.000",
      rating: 4.8,
      reviews: 124,
      sold: 500,
      images: [
        "/browni.jpg?height=400&width=400",
        "/ras.jpg?height=400&width=400",
        "/matcha.jpg?height=400&width=400",
      ],
      category: "Makanan",
      location: "Yogyakarta",
      discount: 17,
      description:
        "Fudgy brownies adalah kue cokelat yang kaya dan moist, terkenal karena teksturnya yang padat dan fudgy..",
      specifications: [
        { label: "Berat", value: "300 gram" },
        { label: "Kemasan", value: "Standing pouch" },
        { label: "Expired", value: "6 bulan" },
        { label: "Bahan", value: "Cokelat, mentega, gula, telur, dan sedikit tepung" },
      ],
      businessInfo: {
        name: "Sweet Bites",
        owner: "Ibu Sari Wijaya",
        established: "2018",
        address: "Jl. Malioboro No. 123, Yogyakarta",
        phone: "+62 812-3456-7890",
        email: "sweet.bites@email.com",
        description:
          "UMKM keluarga yang telah berpengalaman lebih dari 5 tahun dalam memproduksi keripik singkong berkualitas tinggi dengan cita rasa autentik Yogyakarta.",
      },
    },
    {
      id: "2",
      name: "Tas Rajut Handmade Premium",
      business: "Rajut Cantik",
      price: "Rp 85.000",
      originalPrice: null,
      rating: 4.9,
      reviews: 89,
      sold: 156,
      images: ["/rajut.jpg?height=400&width=400"],
      category: "Kerajinan",
      location: "Bandung",
      discount: 0,
      description:
        "Tas rajut handmade dengan kualitas premium, dibuat dengan teknik rajut tradisional yang dikombinasikan dengan desain modern.",
      specifications: [
        { label: "Bahan", value: "Benang katun premium" },
        { label: "Ukuran", value: "30x25x10 cm" },
        { label: "Warna", value: "Tersedia berbagai warna" },
      ],
      businessInfo: {
        name: "Rajut Cantik",
        owner: "Ibu Maya Sari",
        established: "2020",
        address: "Jl. Dago No. 45, Bandung",
        phone: "+62 822-1234-5678",
        email: "rajut.cantik@email.com",
        description: "UMKM yang fokus pada produk rajutan berkualitas tinggi dengan desain yang trendy dan modern.",
      },
    },
    {
       id: "3",
      name: "Smoothie",
      business: "Fruity Vibes",
      price: "Rp 36.000",
      originalPrice: "Rp 40.000",
      rating: 4.7,
      reviews: 90,
      sold: 200,
      images: [
        "/smoothie.jpg?height=400&width=400",
      ],
      category: "Minuman",
      location: "Purwokerto",
      discount: 10,
      description:
        "Smoothie segar yang dibuat dari buah-buahan pilihan dengan tambahan yogurt dan madu alami. Cocok untuk menjaga kesehatan dan memberikan energi sepanjang hari.",
      specifications: [
        { label: "Volume", value: "500ml" },
        { label: "Kemasan", value: "Botol kaca" },
        { label: "Expired", value: "3 hari" },
        { label: "Bahan", value: "Buah segar, yogurt, madu" },
      ],
      businessInfo: {
        name: "Fruity Vibes",
        owner: "Bapak Andi Prasetyo",
        established: "2021",
        address: "Jl. Gatot Subroto No. 67, Purwokerto",
        phone: "+62 813-2345-6789",
        email: "fruity.vibes@email.com",
        description: "UMKM yang mengkhususkan diri dalam pembuatan minuman sehat dari buah-buahan segar berkualitas.",
      },
    },
    {
      id: "4",
      name: "Baju Batik",
      business: "Batik Heritage",
      price: "Rp 150.000",
      originalPrice: null,
      rating: 4.9,
      reviews: 67,
      sold: 120,
      images: [
        "/batik.jpg?height=400&width=400",
       
      ],
      category: "Fashion",
      location: "Solo",
      discount: 0,
      description:
        "Baju batik dengan motif tradisional Jawa yang dibuat dengan teknik batik tulis dan cap. Menggunakan bahan katun berkualitas tinggi yang nyaman digunakan.",
      specifications: [
        { label: "Bahan", value: "Katun premium" },
        { label: "Ukuran", value: "S, M, L, XL" },
        { label: "Motif", value: "Parang, Kawung, Mega Mendung" },
        { label: "Perawatan", value: "Cuci dengan air dingin" },
      ],
      businessInfo: {
        name: "Batik Heritage",
        owner: "Ibu Siti Nurhaliza",
        established: "2015",
        address: "Jl. Ronggowarsito No. 89, Solo",
        phone: "+62 814-3456-7890",
        email: "batik.heritage@email.com",
        description: "UMKM yang melestarikan warisan budaya batik dengan menggabungkan motif tradisional dan desain modern.",
      },
    },
    {
      id: "5",
      name: "Sepatu Kulit Handmade",
      business: "Leather Craft",
      price: "Rp 250.000",
      originalPrice: null,
      rating: 4.6,
      reviews: 50,
      sold: 80,
      images: [
        "/sepatu.jpg?height=400&width=400",
        
      ],
      category: "Fashion",
      location: "Cibaduyut",
      discount: 0,
      description:
        "Sepatu kulit handmade dengan kualitas premium, dibuat oleh pengrajin berpengalaman. Menggunakan kulit asli dan jahitan yang kuat untuk daya tahan maksimal.",
      specifications: [
        { label: "Bahan", value: "Kulit sapi asli" },
        { label: "Ukuran", value: "39-44" },
        { label: "Warna", value: "Hitam, Coklat" },
        { label: "Sol", value: "Karet anti slip" },
      ],
      businessInfo: {
        name: "Leather Craft",
        owner: "Bapak Joko Santoso",
        established: "2017",
        address: "Jl. Cibaduyut Raya No. 156, Bandung",
        phone: "+62 815-4567-8901",
        email: "leather.craft@email.com",
        description: "UMKM yang mengkhususkan diri dalam pembuatan sepatu kulit berkualitas tinggi dengan desain klasik dan modern.",
      },
    },
  ]

    

  return products.find((p) => p.id === id) || null
}

export async function getAllProductIds() {
  // In production, this would fetch from your database
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    // Add more product IDs as needed
  ]
}
