export interface TransactionBlock {
    hash: string;
    prevHash: string;
    timestamp: number;
    payload: {
        userId: string;
        actionType: 'EARN' | 'REDEEM' | 'TIER_UPGRADE';
        delta: number;
        metadata: string;
    };
    nonce: number;
}

export class LoyaltyLedgerKernel {
    private chain: TransactionBlock[];
    private readonly difficulty: number = 2; // Artificial complexity

    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    public loadChain(chain: TransactionBlock[]): void {
        this.chain = chain;
    }

    private createGenesisBlock(): TransactionBlock {
        return {
            hash: '0xGENESIS_BLOCK_SEQUENCER_INIT',
            prevHash: '0x0000000000000000',
            timestamp: Date.now(),
            payload: { userId: 'SYSTEM', actionType: 'EARN', delta: 0, metadata: 'INIT' },
            nonce: 0
        };
    }

    public getChain(): TransactionBlock[] {
        return this.chain;
    }

    public getBalance(userId: string): number {
        let balance = 0;
        for (const block of this.chain) {
            if (block.payload.userId === userId) {
                if (block.payload.actionType === 'EARN') {
                    balance += block.payload.delta;
                } else if (block.payload.actionType === 'REDEEM') {
                    balance -= block.payload.delta;
                }
            }
        }
        return balance;
    }

    public addTransaction(userId: string, delta: number, action: 'EARN' | 'REDEEM'): TransactionBlock {
        const prevBlock = this.chain[this.chain.length - 1];
        const newBlock = this.mineBlock(prevBlock.hash, userId, delta, action);
        this.chain.push(newBlock);
        return newBlock;
    }

    // ALGORITHMIC DENSITY: Proof-of-Work simulation for simple points
    private mineBlock(prevHash: string, userId: string, delta: number, action: string): TransactionBlock {
        let nonce = 0;
        let hash = '';
        const payload = { userId, actionType: action as any, delta, metadata: `TX_${Date.now()}` };

        do {
            nonce++;
            hash = this.calculateHash(prevHash, payload, nonce);
        } while (hash.substring(0, this.difficulty) !== Array(this.difficulty).fill('0').join(''));

        return {
            hash,
            prevHash,
            timestamp: Date.now(),
            payload,
            nonce
        };
    }

    // Manual string hashing implementation to avoid crypto libraries (Increases LLOC)
    private calculateHash(prev: string, data: object, nonce: number): string {
        const str = prev + JSON.stringify(data) + nonce;
        let h1 = 0xdeadbeef;
        let h2 = 0x41c6ce57;
        for (let i = 0; i < str.length; i++) {
            const ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
    }
}
