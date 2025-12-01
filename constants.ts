
import { MenuItem, Testimonial, BlogPost, FAQ, CustomMenuItem } from './types';

export const WHATSAPP_NUMBER = "628123456789"; // Replace with real number

// Dynamic Promo Configuration
export const PROMO_DATA = {
  isActive: true,
  // Set end time to 24 hours from now for demo purposes
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), 
  discountPercent: 15,
  code: 'FLASH15',
  title: 'Flash Sale Spesial',
  description: 'Diskon 15% untuk semua pemesanan catering acara bulan ini!'
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "Nasi Kotak Ayam Bakar Madu",
    category: "Nasi Kotak",
    price: 35000,
    description: "Nasi putih, ayam bakar madu, tahu tempe, lalapan, sambal terasi, kerupuk, buah.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
    popular: true,
    minOrder: 10,
    pricingType: 'pax'
  },
  {
    id: 2,
    name: "Tumpeng Mini (Tumini) Spesial",
    category: "Tumpeng",
    price: 45000,
    description: "Nasi kuning tumpeng mini dengan 7 macam lauk pauk premium.",
    image: "https://images.unsplash.com/photo-1626508003632-48e02613d288?auto=format&fit=crop&w=500&q=80",
    popular: true,
    minOrder: 10,
    pricingType: 'pax'
  },
  {
    id: 3,
    name: "Paket Aqiqah Hemat (1 Kambing)",
    category: "Aqiqah",
    price: 2350000,
    description: "40-50 Porsi. Nasi putih, gulai kambing, acar, sambal, kerupuk. Bonus sertifikat & souvenir.",
    image: "https://images.unsplash.com/photo-1603088549196-b072f9d78414?auto=format&fit=crop&w=500&q=80",
    minOrder: 1,
    pricingType: 'fixed'
  },
  {
    id: 301,
    name: "Paket Aqiqah Standard (1 Kambing)",
    category: "Aqiqah",
    price: 2850000,
    description: "60-70 Porsi. Nasi kebuli/uduk, sate & gulai, box batik premium.",
    image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=500&q=80",
    minOrder: 1,
    pricingType: 'fixed'
  },
  {
    id: 302,
    name: "Paket Aqiqah Premium (1 Kambing)",
    category: "Aqiqah",
    price: 4550000,
    description: "100-110 Porsi. Nasi Mandhi, 3 menu olahan, Hardbox eksklusif, Video Drone.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
    minOrder: 1,
    pricingType: 'fixed'
  },
  {
    id: 303,
    name: "Kambing Guling Utuh (150 Porsi)",
    category: "Aqiqah",
    price: 7500000,
    description: "Kambing guling utuh + 100 porsi nasi kebuli + prasmanan + chef di lokasi.",
    image: "https://images.unsplash.com/photo-1544025162-d76690b67f61?auto=format&fit=crop&w=500&q=80",
    minOrder: 1,
    pricingType: 'fixed'
  },
  {
    id: 4,
    name: "Prasmanan Gold Wedding",
    category: "Prasmanan",
    price: 85000,
    description: "10 Menu Utama + 3 Pondokan + Dessert + Minuman. Dekorasi buffet included.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=500&q=80",
    minOrder: 50,
    pricingType: 'pax'
  },
  {
    id: 5,
    name: "Snack Box Seminar Premium",
    category: "Snack Box",
    price: 20000,
    description: "1 Roti Bakso, 1 Lemper Ayam, 1 Soes Fla, Air Mineral.",
    image: "https://images.unsplash.com/photo-1594916886477-84614e590022?auto=format&fit=crop&w=500&q=80",
    minOrder: 20,
    pricingType: 'pax'
  },
  {
    id: 6,
    name: "Nasi Kotak Rendang Padang",
    category: "Nasi Kotak",
    price: 40000,
    description: "Nasi putih, rendang daging sapi empuk, sayur nangka, sambal ijo.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80",
    popular: true,
    minOrder: 10,
    pricingType: 'pax'
  },
  {
    id: 7,
    name: "Kue Tart Custom (20cm)",
    category: "Kue",
    price: 350000,
    description: "Base cake coklat/vanilla, desain request sesuai tema acara.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80",
    minOrder: 1,
    pricingType: 'fixed'
  },
  {
    id: 8,
    name: "Tumpeng Besar (20 Pax)",
    category: "Tumpeng",
    price: 950000,
    description: "Tumpeng besar hiasan mewah untuk syukuran kantor atau ulang tahun.",
    image: "https://images.unsplash.com/photo-1643126442651-7f9859f518a4?auto=format&fit=crop&w=500&q=80",
    minOrder: 1,
    pricingType: 'fixed'
  },
  {
    id: 9,
    name: "Tasyakuran Mini (20 Pax)",
    category: "Syukuran",
    price: 850000,
    description: "Paket hemat syukuran: Nasi uduk/kuning, ayam, telur, tumpeng mini.",
    image: "https://images.unsplash.com/photo-1564759077036-3def242e69c5?auto=format&fit=crop&w=500&q=80",
    minOrder: 1,
    pricingType: 'fixed'
  },
  {
    id: 10,
    name: "Nasi Berkat Syukuran (Box Batik)",
    category: "Syukuran",
    price: 28000,
    description: "Nasi putih/kuning, ayam goreng/bakar, mie goreng, telur, kerupuk dalam box motif batik.",
    image: "https://images.unsplash.com/photo-1562967960-f55926648fdb?auto=format&fit=crop&w=500&q=80",
    minOrder: 30,
    pricingType: 'pax'
  },
  // Wedding Packages
  {
    id: 401,
    name: "Intimate Wedding Package",
    category: "Wedding",
    price: 85000,
    description: "50-100 Pax. Nasi kebuli, kambing guling mini, ayam bakar madu, 8 menu pendamping + dessert table. Bonus: Mini tumpeng pengantin.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&w=500&q=80",
    minOrder: 50,
    pricingType: 'pax'
  },
  {
    id: 402,
    name: "Garden Wedding Package",
    category: "Wedding",
    price: 115000,
    description: "150-250 Pax. Prasmanan 12 menu (sate lilit, bebek goreng, iga bakar) + live stall. Bonus: Gubukan mie/sate + 1 portion pengantin.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=500&q=80",
    minOrder: 150,
    pricingType: 'pax'
  },
  {
    id: 403,
    name: "Classic Wedding Package",
    category: "Wedding",
    price: 135000,
    description: "300-500 Pax. Full buffet 15 menu + 3 gubukan + kambing guling utuh. Bonus: Photo booth sederhana + tumpeng pengantin besar.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=80",
    minOrder: 300,
    pricingType: 'pax'
  },
  {
    id: 404,
    name: "Luxury Wedding Package",
    category: "Wedding",
    price: 185000,
    description: "500-1000 Pax. 20 menu premium + live cooking + roasted lamb + free flow dessert. Bonus: Wedding cake 3 tier + video food.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=500&q=80",
    minOrder: 500,
    pricingType: 'pax'
  },
  {
    id: 405,
    name: "Akad Nikah Only (Box Premium)",
    category: "Wedding",
    price: 35000,
    description: "50-150 Pax. Nasi kotak syukuran + kue basah 3 macam + air mineral. Box motif batik pengantin + stiker nama.",
    image: "https://images.unsplash.com/photo-1598214886806-c87b84b7078b?auto=format&fit=crop&w=500&q=80",
    minOrder: 50,
    pricingType: 'pax'
  },
  {
    id: 406,
    name: "One Day Wedding (300 Pax)",
    category: "Wedding",
    price: 45000000,
    description: "Paket Lengkap Akad + Resepsi. Akad: Nasi kotak. Resepsi: Prasmanan 12 menu + 2 gubukan. Diskon booking sekaligus.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80",
    minOrder: 1,
    pricingType: 'fixed'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Siti Aminah",
    role: "HR Manager",
    comment: "Pesan 150 box untuk gathering kantor, semuanya puas! Makanan datang tepat waktu dan masih hangat. Rasanya benar-benar seperti masakan rumahan.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "Budi Santoso",
    role: "Customer Aqiqah",
    comment: "Alhamdulillah acara aqiqah anak kami lancar dibantu Mpok Sari. Satenya empuk, gule-nya tidak bau prengus. Recommended!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Jessica Tan",
    role: "Event Organizer",
    comment: "Partner catering terbaik di Jakarta. Fleksibel banget soal menu dan budget. Tumpeng mininya juara!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "5 Tips Memilih Menu Catering untuk Seminar Kantor",
    excerpt: "Jangan sampai peserta ngantuk! Pilih menu yang tepat dengan gizi seimbang agar meeting tetap produktif.",
    content: `
      <p>Mengadakan seminar atau meeting kantor seharian tentu melelahkan. Salah satu faktor krusial yang sering dilupakan adalah pemilihan menu makanan. Makanan yang terlalu berat bisa membuat peserta mengantuk (food coma), sementara porsi yang terlalu sedikit membuat tidak fokus.</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">1. Hindari Karbohidrat Berlebih</h3>
      <p>Nasi putih dalam jumlah banyak memiliki indeks glikemik tinggi yang cepat menaikkan gula darah lalu menjatuhkannya, memicu kantuk. Cobalah opsi Nasi Merah atau kurangi porsi nasi dan perbanyak protein.</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">2. Perbanyak Sayur & Buah</h3>
      <p>Serat membantu pencernaan lebih lambat sehingga energi dilepas bertahap. Pastikan ada menu tumisan sayur segar atau capcay dalam box catering Anda.</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">3. Pilih Protein yang Tidak Berminyak</h3>
      <p>Alih-alih ayam goreng tepung yang berminyak, cobalah Ayam Bakar Madu atau Ikan Asam Manis. Lemak jenuh yang tinggi membutuhkan energi besar untuk dicerna tubuh.</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">4. Sediakan Air Mineral yang Cukup</h3>
      <p>Dehidrasi ringan sering disalahartikan sebagai rasa lapar atau lelah. Pastikan stok air mineral selalu tersedia, bukan hanya minuman manis.</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">5. Snack Box di Waktu yang Tepat</h3>
      <p>Sajikan snack box (coffee break) di jam 10 pagi dan 3 sore untuk menjaga kadar gula darah peserta tetap stabil. Kombinasikan rasa manis (soes/brownies) dan asin (lemper/risoles).</p>
    `,
    date: "12 Okt 2023",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    slug: "tips-menu-catering",
    author: "Mpok Sari"
  },
  {
    id: 2,
    title: "Filosofi Tumpeng: Bukan Sekedar Nasi Kuning",
    excerpt: "Makna mendalam di balik bentuk kerucut dan 7 lauk pauk tumpeng tradisional yang penuh doa.",
    content: `
      <p>Tumpeng bukan sekadar sajian kuliner, melainkan representasi hubungan manusia dengan Tuhan dan alam semesta. Bentuk kerucutnya menyimbolkan gunung (tempat bersemayamnya hyang/dewa dalam kepercayaan leluhur) serta tangan yang merucut berdoa kepada Tuhan Yang Maha Esa.</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">Warna Kuning & Emas</h3>
      <p>Nasi tumpeng biasanya berwarna kuning yang melambangkan kemakmuran, kekayaan, dan moral yang luhur. Harapannya, yang punya hajat akan mendapatkan rezeki yang melimpah dan berkah.</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">7 Macam Lauk (Pitu)</h3>
      <p>Dalam bahasa Jawa, tujuh adalah "Pitu", yang merupakan akronim dari "Pitulungan" (Pertolongan). Tumpeng biasanya dikelilingi oleh 7 jenis lauk pauk yang mewakili unsur darat, laut, dan udara. Contohnya:</p>
      <ul class="list-disc pl-5 mt-2 mb-4 space-y-1">
        <li>Ayam (Darat/Udara): Melambangkan ketenangan hati.</li>
        <li>Ikan Teri/Lele (Air): Melambangkan keuletan dan ketabahan.</li>
        <li>Sayur Urap: Melambangkan beragam karakter yang bersatu memberikan manfaat.</li>
        <li>Telur Rebus: Melambangkan kebulatan tekad.</li>
      </ul>
      <p>Jadi, saat Anda memotong tumpeng, ingatlah bahwa Anda sedang memanjatkan doa syukur dan harapan akan pertolongan Tuhan.</p>
    `,
    date: "28 Sep 2023",
    image: "https://images.unsplash.com/photo-1564759077036-3def242e69c5?auto=format&fit=crop&w=800&q=80",
    slug: "filosofi-tumpeng",
    author: "Pak Budi (Budayawan)"
  },
  {
    id: 3,
    title: "Resep Sambal Goreng Ati Ampela Spesial Lebaran",
    excerpt: "Bocoran resep rahasia dapur Mpok Sari yang selalu jadi favorit pelanggan saat hari raya.",
    content: `
      <p>Sambal Goreng Ati Ampela adalah menu wajib saat Lebaran atau acara syukuran. Perpaduan rasa pedas, gurih santan, dan tekstur ati yang lembut membuat makan ketupat makin nikmat. Ini dia resep andalan dapur Mpok Sari!</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">Bahan-bahan:</h3>
      <ul class="list-disc pl-5 mb-4">
        <li>500gr Ati Ampela (Rebus dengan daun salam & jahe, lalu potong dadu)</li>
        <li>2 buah Kentang besar (Potong dadu, goreng setengah matang)</li>
        <li>1 papan Petai (Kupas)</li>
        <li>200ml Santan kental</li>
        <li>Lengkuas, Daun Salam, Daun Jeruk, Serai</li>
      </ul>
      <h3 class="text-xl font-bold mb-2">Bumbu Halus:</h3>
      <ul class="list-disc pl-5 mb-4">
        <li>10 butir Bawang Merah</li>
        <li>5 siung Bawang Putih</li>
        <li>15 buah Cabai Merah Keriting (Rebus sebentar agar warna merah menyala)</li>
        <li>3 butir Kemiri sangrai</li>
        <li>Gula merah, Garam, Kaldu bubuk secukupnya</li>
      </ul>
      <h3 class="text-xl font-bold mb-2">Cara Membuat:</h3>
      <ol class="list-decimal pl-5 space-y-2">
        <li>Tumis bumbu halus bersama daun salam, daun jeruk, serai, dan lengkuas hingga harum dan matang (minyaknya keluar). Ini kunci agar sambal goreng tidak cepat basi.</li>
        <li>Masukkan ati ampela dan petai, aduk rata.</li>
        <li>Tuangkan santan, masak dengan api kecil hingga santan menyusut dan bumbu meresap.</li>
        <li>Terakhir, masukkan kentang goreng. Aduk sebentar saja agar kentang tidak hancur.</li>
        <li>Koreksi rasa, angkat, dan sajikan dengan taburan bawang goreng.</li>
      </ol>
    `,
    date: "15 Sep 2023",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    slug: "resep-sambal-goreng",
    author: "Chef Mpok Sari"
  },
  {
    id: 4,
    title: "10 Tips Catering Acara Islami Biar Makin Berkah",
    excerpt: "Mulai dari pemilihan box yang syar'i hingga tips sedekah makanan yang tepat sasaran untuk aqiqah & walimah.",
    content: `
      <p>Menyelenggarakan acara seperti Aqiqah, Walimatul Ursy (Pernikahan), atau Tasyakuran bukan hanya soal memberi makan tamu, tapi juga mencari keberkahan. Berikut tips dari Mpok Sari agar acara Anda makin berkah:</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">1. Pastikan Kehalalan Mutlak</h3>
      <p>Pilih catering yang bersertifikat Halal MUI. Bukan hanya bahan makanannya (bebas babi/alkohol), tapi juga cara penyembelihan hewan (untuk aqiqah) dan kebersihan dapurnya.</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">2. Niatkan Sedekah</h3>
      <p>Saat membayar catering, niatkan dalam hati untuk memuliakan tamu dan bersedekah. InsyaAllah uang yang dikeluarkan akan diganti berlipat ganda oleh Allah SWT.</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">3. Sertakan Kartu Doa</h3>
      <p>Di setiap nasi kotak, selipkan kartu ucapan yang berisi doa (misal: doa untuk bayi aqiqah). Tamu yang membaca akan ikut mengaminkan.</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">4. Alokasikan untuk Yatim & Dhuafa</h3>
      <p>Sisihkan minimal 10% dari total pesanan untuk diantar ke panti asuhan atau dibagikan ke kaum dhuafa sekitar. Mpok Sari menyediakan layanan penyaluran gratis ke panti asuhan rekanan.</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">5. Hindari Mubazir (Israf)</h3>
      <p>Pesan porsi sesuai jumlah undangan. Jika acara prasmanan, sediakan plastik/box take-away agar sisa makanan layak konsumsi bisa dibawa pulang tamu dan tidak terbuang.</p>
    `,
    date: "20 Okt 2023",
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80",
    slug: "tips-catering-islami",
    author: "Ustadz H. Ahmad"
  },
  {
    id: 5,
    title: "Tren Pernikahan Intimate 2025: Lebih Hemat & Bermakna",
    excerpt: "Mengapa banyak pasangan muda beralih ke konsep Intimate Wedding? Simak keuntungan dan tips menu cateringnya.",
    content: `
      <p>Pasca-pandemi, tren pernikahan bergeser drastis. Pesta besar-besaran dengan ribuan tamu mulai ditinggalkan, digantikan oleh <strong>Intimate Wedding</strong> yang hanya mengundang 50-200 orang keluarga dan teman terdekat.</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">Kenapa Intimate Wedding?</h3>
      <ul class="list-disc pl-5 mb-4">
        <li><strong>Quality Time:</strong> Pengantin bisa benar-benar menyapa dan ngobrol dengan setiap tamu, bukan sekadar salaman di pelaminan.</li>
        <li><strong>Budget Efisien:</strong> Biaya sewa gedung raksasa bisa dialihkan untuk makanan yang lebih premium, souvenir berkesan, atau tabungan rumah tangga.</li>
        <li><strong>Suasana Sakral:</strong> Momen akad dan resepsi terasa lebih hangat, emosional, dan privat.</li>
      </ul>
      <br/>
      <h3 class="text-xl font-bold mb-2">Rekomendasi Menu Catering Intimate</h3>
      <p>Karena jumlah tamu sedikit, Anda bisa menyajikan menu yang lebih personal dan mewah:</p>
      <ul class="list-disc pl-5 mb-4">
        <li><strong>Kambing Guling:</strong> Selalu jadi primadona yang membuat suasana cair saat mengantre.</li>
        <li><strong>Live Cooking Stall:</strong> Pasta corner atau Teppanyaki memberikan hiburan tersendiri bagi tamu.</li>
        <li><strong>Dessert Table Cantik:</strong> Sediakan aneka pudding, kue mini, dan buah potong yang Instagramable.</li>
      </ul>
      <p>Di Mpok Sari, kami punya <em>Intimate Wedding Package</em> mulai Rp 85.000/pax yang sudah mencakup dekorasi buffet estetik!</p>
    `,
    date: "10 Jan 2025",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&w=800&q=80",
    slug: "tren-pernikahan-intimate",
    author: "Nana (Wedding Consultant)"
  },
  {
    id: 6,
    title: "Manfaat Catering Sehat untuk Produktivitas Karyawan",
    excerpt: "Investasi makan siang kantor bukan pengeluaran sia-sia. Karyawan sehat, omzet perusahaan meningkat!",
    content: `
      <p>Seringkali karyawan asal memilih makan siang: mie instan, gorengan pinggir jalan, atau makanan tinggi MSG. Dampaknya? Mengantuk setelah jam 1 siang, sering sakit, dan produktivitas menurun.</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">Dampak Gizi Buruk pada Kerja</h3>
      <p>Studi WHO menunjukkan bahwa nutrisi yang cukup dapat meningkatkan produktivitas kerja hingga 20%. Makanan tinggi lemak jenuh dan gula membuat otak 'kabut' (brain fog) dan tubuh lesu.</p>
      <br/>
      <h3 class="text-xl font-bold mb-2">Solusi: Corporate Catering Mpok Sari</h3>
      <p>Kami menyusun menu mingguan yang seimbang antara Karbohidrat, Protein, dan Serat:</p>
      <ul class="list-disc pl-5 mb-4">
        <li><strong>Senin:</strong> Nasi Merah, Ayam Bakar (Tanpa Santan), Sayur Asem, Buah.</li>
        <li><strong>Rabu:</strong> Ikan Pesmol, Tumis Buncis Jagung, Tahu Bacem.</li>
        <li><strong>Jumat:</strong> Sate Ayam (Daging Dada), Capcay Kuah, Kerupuk.</li>
      </ul>
      <p>Dengan berlangganan catering kantor, perusahaan memastikan karyawan mendapat asupan gizi terjaga, higienis, dan tidak perlu pusing memikirkan "mau makan apa siang ini?". Waktu istirahat jadi lebih efisien!</p>
    `,
    date: "05 Feb 2025",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
    slug: "manfaat-catering-kantor",
    author: "Dr. Gizi Mpok Sari"
  }
];

export const FAQS: FAQ[] = [
  {
    question: "Apakah makanan dijamin Halal?",
    answer: "Ya, 100% Halal. Kami memiliki sertifikasi Halal MUI dan hanya menggunakan bahan-bahan halal dari supplier terpercaya."
  },
  {
    question: "Berapa minimal order?",
    answer: "Untuk nasi kotak minimal 10 pax. Untuk prasmanan minimal 50 pax. Snack box minimal 20 pax. Tumpeng besar bisa pesan 1."
  },
  {
    question: "Apakah bisa delivery ke seluruh Jakarta?",
    answer: "Kami melayani pengiriman ke seluruh wilayah Jakarta, Depok, Tangerang, dan Bekasi. Ongkir menyesuaikan jarak (Gratis ongkir radius 5km)."
  },
  {
    question: "Bagaimana cara pembayarannya?",
    answer: "DP 50% saat pemesanan untuk mengunci tanggal, pelunasan H-1 atau saat pengiriman (COD khusus order kecil)."
  }
];

export const CUSTOM_MENU_ITEMS: CustomMenuItem[] = [
  // Karbo
  { id: 'k1', name: 'Nasi Putih Wangi', category: 'Karbo', price: 5000, image: 'https://images.unsplash.com/photo-1577156942691-18e3c431418e?w=200' },
  { id: 'k2', name: 'Nasi Kuning Gurih', category: 'Karbo', price: 7000, image: 'https://images.unsplash.com/photo-1596910547037-846b1980329f?w=200' },
  { id: 'k3', name: 'Nasi Liwet Teri', category: 'Karbo', price: 8000, image: 'https://images.unsplash.com/photo-1604503764515-373981882d2c?w=200' },
  { id: 'k4', name: 'Nasi Merah Organik', category: 'Karbo', price: 7000, image: 'https://images.unsplash.com/photo-1626804475297-411f8c1b7533?w=200' },

  // Ayam
  { id: 'a1', name: 'Ayam Goreng Lengkuas', category: 'Ayam', price: 12000, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200' },
  { id: 'a2', name: 'Ayam Bakar Madu', category: 'Ayam', price: 13000, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=200' },
  { id: 'a3', name: 'Ayam Rica-Rica', category: 'Ayam', price: 13000, image: 'https://images.unsplash.com/photo-1602196627061-006f15647a6d?w=200' },
  { id: 'a4', name: 'Ayam Geprek Sambal Bawang', category: 'Ayam', price: 12000, image: 'https://images.unsplash.com/photo-1644365313989-183422db7b5f?w=200' },

  // Daging
  { id: 'd1', name: 'Rendang Daging Sapi', category: 'Daging', price: 18000, image: 'https://images.unsplash.com/photo-1603088549196-b072f9d78414?w=200' },
  { id: 'd2', name: 'Empal Gepuk', category: 'Daging', price: 17000, image: 'https://images.unsplash.com/photo-1645696301019-35adcc18fc21?w=200' },
  { id: 'd3', name: 'Rolade Daging Saus Tiram', category: 'Daging', price: 15000, image: 'https://images.unsplash.com/photo-1542528180-a1208c5169a5?w=200' },

  // Seafood
  { id: 's1', name: 'Udang Balado Petai', category: 'Seafood', price: 16000, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200' },
  { id: 's2', name: 'Ikan Fillet Asam Manis', category: 'Seafood', price: 14000, image: 'https://images.unsplash.com/photo-1535922383042-3b2d12e6191b?w=200' },

  // Sayur
  { id: 'v1', name: 'Capcay Seafood', category: 'Sayur', price: 8000, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200' },
  { id: 'v2', name: 'Tumis Buncis Daging Cincang', category: 'Sayur', price: 7000, image: 'https://images.unsplash.com/photo-1608688755673-585a9756184a?w=200' },
  { id: 'v3', name: 'Sayur Asem Jakarta', category: 'Sayur', price: 6000, image: 'https://images.unsplash.com/photo-1629196896173-82c81729067b?w=200' },

  // Pendamping
  { id: 'p1', name: 'Perkedel Kentang', category: 'Pendamping', price: 3000, image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=200', "minQty": 10 },
  { id: 'p2', name: 'Sambal Goreng Ati Ampela', category: 'Pendamping', price: 6000, image: 'https://images.unsplash.com/photo-1596707328224-3453715d9a0d?w=200' },
  { id: 'p3', name: 'Tahu & Tempe Bacem', category: 'Pendamping', price: 4000, image: 'https://images.unsplash.com/photo-1628155940250-13f6990d0c36?w=200' },
  { id: 'p4', name: 'Mie Goreng Jawa', category: 'Pendamping', price: 5000, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=200' },

  // Dessert
  { id: 'ds1', name: 'Puding Coklat Vla', category: 'Dessert', price: 5000, image: 'https://images.unsplash.com/photo-1589333830588-4444530d970e?w=200' },
  { id: 'ds2', name: 'Buah Potong Segar', category: 'Dessert', price: 5000, image: 'https://images.unsplash.com/photo-1548655848-f674680c2f81?w=200' },
  { id: 'ds3', name: 'Es Teler', category: 'Dessert', price: 12000, image: 'https://images.unsplash.com/photo-1599525412497-6a1656f50b98?w=200' },

  // Minuman
  { id: 'dr1', name: 'Air Mineral', category: 'Minuman', price: 1000, image: 'https://images.unsplash.com/photo-1523362628408-3c760ec8537d?w=200' },
  { id: 'dr2', name: 'Teh Kotak', category: 'Minuman', price: 4000, "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200" },
  { id: 'dr3', name: 'Jus Jeruk Segar', category: 'Minuman', price: 10000, "image": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200" }
];
