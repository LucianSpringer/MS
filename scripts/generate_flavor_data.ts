
import * as fs from 'fs';
import * as path from 'path';

// Simple implementation of the tensor logic for the script to avoid import issues if ts-node isn't configured for path aliases
class GastronomicTensor {
    public readonly flavorMatrix: Float32Array;
    private readonly entropySeed: number;

    constructor(seed: number, dimensions: number = 512) {
        this.entropySeed = seed;
        this.flavorMatrix = new Float32Array(dimensions);
        this.initializeMatrix();
    }

    private initializeMatrix(): void {
        for (let i = 0; i < this.flavorMatrix.length; i++) {
            const u = 1 - Math.random();
            const v = Math.random();
            const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            this.flavorMatrix[i] = z * this.entropySeed;
        }
    }
}

const MENU_NAMES = [
    "Ayam Bakar Madu", "Tumpeng Mini", "Rendang Sapi", "Sate Ayam", "Gado Gado",
    "Nasi Goreng Kampung", "Soto Betawi", "Sop Buntut", "Ikan Gurame Asam Manis",
    "Capcay Seafood", "Mie Goreng Jawa", "Nasi Uduk", "Nasi Kuning", "Ayam Penyet",
    "Bebek Goreng", "Sayur Asem", "Tumis Kangkung", "Perkedel Kentang", "Tahu Bacem",
    "Tempe Mendoan", "Es Teler", "Es Cendol", "Jus Alpukat", "Kopi Tubruk",
    "Teh Manis Hangat", "Klepon", "Onde Onde", "Lapis Legit", "Bika Ambon",
    "Martabak Manis", "Martabak Telur", "Pempek Palembang", "Tekwan", "Model",
    "Laksan", "Celimpungan", "Burgo", "Lakso", "Mie Celor", "Tempoyak",
    "Pindang Patin", "Brekecek", "Gudeg Jogja", "Krecek", "Opor Ayam",
    "Ketupat Sayur", "Lontong Cap Go Meh", "Asinan Betawi", "Kerak Telor", "Bir Pletok"
];

const OUTPUT_DIR = path.join(process.cwd(), 'src/core/data');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

MENU_NAMES.forEach((name, index) => {
    const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + index;
    const tensor = new GastronomicTensor(seed);
    const vectorArray = Array.from(tensor.flavorMatrix);

    const fileContent = `// Generated Flavor Vector for ${name}
// Dimensions: 512
// Entropy Seed: ${seed}

export const ${name.replace(/\s+/g, '')}_Vector = new Float32Array([
    ${vectorArray.join(', ')}
]);
`;

    const fileName = `${name.replace(/\s+/g, '')}.ts`;
    fs.writeFileSync(path.join(OUTPUT_DIR, fileName), fileContent);
    console.log(`Generated ${fileName}`);
});

console.log(`Successfully generated ${MENU_NAMES.length} flavor vector files.`);
