// Shared types for menu data

export interface MenuItem {
    id: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    spiceLevel: 0 | 1 | 2 | 3;
    isAvailable: boolean;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    displayOrder: number;
    isActive: boolean;
}
