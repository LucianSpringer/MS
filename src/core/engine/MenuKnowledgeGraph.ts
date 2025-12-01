// src/core/engine/MenuKnowledgeGraph.ts
import * as FlavorVectors from '../data';
import { MenuItem, Testimonial, BlogPost, FAQ, CustomMenuItem, Category } from '../../../types';

// Deterministic Random Number Generator based on seed
class DeterministicRNG {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    // Linear Congruential Generator
    next(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
}

export class MenuKnowledgeGraph {
    private rng: DeterministicRNG;
    private marketVolatility: number;

    constructor() {
        // Simulate market volatility based on time
        const now = new Date();
        const timeSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
        this.rng = new DeterministicRNG(timeSeed);
        this.marketVolatility = 0.8 + (this.rng.next() * 0.4); // 0.8 to 1.2
    }

    public getMenuItems(): MenuItem[] {
        const items: MenuItem[] = [];
        const vectorKeys = Object.keys(FlavorVectors);

        // Generate Menu Items from Vectors
        // We map the vector names back to readable names and generate prices

        vectorKeys.forEach((key, index) => {
            // key is like "AyamBakarMadu_Vector"
            const name = key.replace('_Vector', '').replace(/([A-Z])/g, ' $1').trim();
            const basePrice = 15000 + (this.rng.next() * 30000);
            const adjustedPrice = Math.round((basePrice * this.marketVolatility) / 1000) * 1000;

            // Determine category based on name keywords
            let category: Category = 'Lainnya';
            if (name.includes('Nasi') || name.includes('Kotak')) category = 'Nasi Kotak';
            else if (name.includes('Tumpeng')) category = 'Tumpeng';
            else if (name.includes('Aqiqah') || name.includes('Kambing')) category = 'Aqiqah';
            else if (name.includes('Prasmanan')) category = 'Prasmanan';
            else if (name.includes('Wedding')) category = 'Wedding';
            else if (name.includes('Kue') || name.includes('Tart')) category = 'Kue';
            else if (name.includes('Snack')) category = 'Snack Box';
            else if (name.includes('Es') || name.includes('Jus') || name.includes('Kopi') || name.includes('Teh')) category = 'Minuman';
            else if (name.includes('Klepon') || name.includes('Onde') || name.includes('Lapis')) category = 'Kue';

            // Generate description using "AI" (Templates + Randomness)
            const adjectives = ['Lezat', 'Gurih', 'Nikmat', 'Spesial', 'Premium', 'Otentik', 'Segar', 'Mantap'];
            const adj = adjectives[this.rng.nextInt(0, adjectives.length - 1)];
            const description = `${name} yang ${adj.toLowerCase()}, diolah dengan bumbu rahasia warisan leluhur.`;

            items.push({
                id: index + 1,
                name: name,
                category: category,
                price: adjustedPrice,
                description: description,
                image: this.getImageFor(name),
                popular: this.rng.next() > 0.8,
                minOrder: category === 'Wedding' || category === 'Prasmanan' ? 50 : (category === 'Snack Box' ? 20 : 1),
                pricingType: (category === 'Wedding' || category === 'Prasmanan' || category === 'Nasi Kotak' || category === 'Snack Box') ? 'pax' : 'fixed'
            });
        });

        return items;
    }

    private getImageFor(name: string): string {
        // Simple mapping or placeholder
        if (name.includes('Ayam')) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80";
        if (name.includes('Tumpeng')) return "https://images.unsplash.com/photo-1626508003632-48e02613d288?auto=format&fit=crop&w=500&q=80";
        if (name.includes('Rendang')) return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80";
        if (name.includes('Sate')) return "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=500&q=80";
        if (name.includes('Nasi Goreng')) return "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=500&q=80";
        if (name.includes('Soto')) return "https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=500&q=80";
        if (name.includes('Es')) return "https://images.unsplash.com/photo-1599525412497-6a1656f50b98?auto=format&fit=crop&w=500&q=80";
        if (name.includes('Kopi')) return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80";
        return "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=500&q=80";
    }

    // Re-export other constants to maintain compatibility
    public getTestimonials(): Testimonial[] {
        return [
            {
                id: 1,
                name: "Siti Aminah",
                role: "HR Manager",
                comment: "Pesan 150 box untuk gathering kantor, semuanya puas! Makanan datang tepat waktu dan masih hangat.",
                rating: 5,
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
            },
            {
                id: 2,
                name: "Budi Santoso",
                role: "Customer Aqiqah",
                comment: "Alhamdulillah acara aqiqah anak kami lancar dibantu Mpok Sari. Satenya empuk, gule-nya tidak bau prengus.",
                rating: 5,
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
            }
        ];
    }

    public getBlogPosts(): BlogPost[] {
        return [
            {
                id: 1,
                title: "5 Tips Memilih Menu Catering untuk Seminar Kantor",
                excerpt: "Jangan sampai peserta ngantuk! Pilih menu yang tepat dengan gizi seimbang agar meeting tetap produktif.",
                content: "<p>Content placeholder...</p>",
                date: "12 Okt 2023",
                image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
                slug: "tips-menu-catering",
                author: "Mpok Sari"
            }
        ];
    }

    public getFAQs(): FAQ[] {
        return [
            {
                question: "Apakah makanan dijamin Halal?",
                answer: "Ya, 100% Halal. Kami memiliki sertifikasi Halal MUI dan hanya menggunakan bahan-bahan halal dari supplier terpercaya."
            }
        ];
    }
}

export const knowledgeGraph = new MenuKnowledgeGraph();
export const MENU_ITEMS = knowledgeGraph.getMenuItems();
export const TESTIMONIALS = knowledgeGraph.getTestimonials();
export const BLOG_POSTS = knowledgeGraph.getBlogPosts();
export const FAQS = knowledgeGraph.getFAQs();
export const WHATSAPP_NUMBER = "628123456789";
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

export const PROMO_DATA = {
    isActive: true,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    discountPercent: 15,
    code: 'FLASH15',
    title: 'Flash Sale Spesial',
    description: 'Diskon 15% untuk semua pemesanan catering acara bulan ini!'
};
