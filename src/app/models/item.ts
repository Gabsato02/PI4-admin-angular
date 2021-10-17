import { Characteristic } from './characteristic';
import { Trait } from './trait';

export interface Item {
    id?: number;
    name: string;
    price: number;
    description: string;
    volume: string;
    category_id: number;
    traits: Array<Trait>;
    characteristics: Array<Characteristic>;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
}
