// Food images
import samosaImg from '@/assets/food/samosa.jpg';
import chickenTikkaImg from '@/assets/food/chicken-tikka.jpg';
import onionBhajiImg from '@/assets/food/onion-bhaji.jpg';
import paneerTikkaImg from '@/assets/food/paneer-tikka.jpg';
import butterChickenImg from '@/assets/food/butter-chicken.jpg';
import lambRoganJoshImg from '@/assets/food/lamb-rogan-josh.jpg';
import palakPaneerImg from '@/assets/food/palak-paneer.jpg';
import chickenVindalooImg from '@/assets/food/chicken-vindaloo.jpg';
import dalMakhaniImg from '@/assets/food/dal-makhani.jpg';
import chanaMasalaImg from '@/assets/food/chana-masala.jpg';
import chickenBiryaniImg from '@/assets/food/chicken-biryani.jpg';
import lambBiryaniImg from '@/assets/food/lamb-biryani.jpg';
import vegetableBiryaniImg from '@/assets/food/vegetable-biryani.jpg';
import garlicNaanImg from '@/assets/food/garlic-naan.jpg';
import plainNaanImg from '@/assets/food/plain-naan.jpg';
import cheeseNaanImg from '@/assets/food/cheese-naan.jpg';
import rotiImg from '@/assets/food/roti.jpg';
import mangoLassiImg from '@/assets/food/mango-lassi.jpg';
import sweetLassiImg from '@/assets/food/sweet-lassi.jpg';
import masalaChaiImg from '@/assets/food/masala-chai.jpg';
import gulabJamunImg from '@/assets/food/gulab-jamun.jpg';
import kheerImg from '@/assets/food/kheer.jpg';
import mangoKulfiImg from '@/assets/food/mango-kulfi.jpg';

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
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

export const categories: Category[] = [
  { id: '1', name: 'Starters', slug: 'starters', displayOrder: 1, isActive: true },
  { id: '2', name: 'Mains', slug: 'mains', displayOrder: 2, isActive: true },
  { id: '3', name: 'Biryani', slug: 'biryani', displayOrder: 3, isActive: true },
  { id: '4', name: 'Breads', slug: 'breads', displayOrder: 4, isActive: true },
  { id: '5', name: 'Drinks', slug: 'drinks', displayOrder: 5, isActive: true },
  { id: '6', name: 'Desserts', slug: 'desserts', displayOrder: 6, isActive: true },
];

export const menuItems: MenuItem[] = [
  // Starters
  {
    id: 's1',
    categoryId: '1',
    name: 'Samosa',
    description: 'Crispy pastry filled with spiced potatoes and peas, served with mint chutney',
    price: 5.95,
    imageUrl: samosaImg,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    spiceLevel: 1,
    isAvailable: true,
  },
  {
    id: 's2',
    categoryId: '1',
    name: 'Chicken Tikka',
    description: 'Tender chicken pieces marinated in yogurt and spices, grilled in tandoor',
    price: 8.95,
    imageUrl: chickenTikkaImg,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: 2,
    isAvailable: true,
  },
  {
    id: 's3',
    categoryId: '1',
    name: 'Onion Bhaji',
    description: 'Crispy onion fritters with aromatic spices and herbs',
    price: 5.50,
    imageUrl: onionBhajiImg,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    spiceLevel: 1,
    isAvailable: true,
  },
  {
    id: 's4',
    categoryId: '1',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese cubes with bell peppers and Indian spices',
    price: 7.95,
    imageUrl: paneerTikkaImg,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: 2,
    isAvailable: true,
  },
  // Mains
  {
    id: 'm1',
    categoryId: '2',
    name: 'Butter Chicken',
    description: 'Tender chicken in creamy tomato sauce with aromatic spices',
    price: 16.95,
    imageUrl: butterChickenImg,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: 1,
    isAvailable: true,
  },
  {
    id: 'm2',
    categoryId: '2',
    name: 'Lamb Rogan Josh',
    description: 'Slow-cooked lamb in rich Kashmiri spices and yogurt gravy',
    price: 18.95,
    imageUrl: lambRoganJoshImg,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: 2,
    isAvailable: true,
  },
  {
    id: 'm3',
    categoryId: '2',
    name: 'Palak Paneer',
    description: 'Cottage cheese cubes in creamy spinach gravy with garlic',
    price: 14.95,
    imageUrl: palakPaneerImg,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: 1,
    isAvailable: true,
  },
  {
    id: 'm4',
    categoryId: '2',
    name: 'Chicken Vindaloo',
    description: 'Fiery Goan curry with potatoes and tangy vinegar notes',
    price: 16.95,
    imageUrl: chickenVindalooImg,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: 3,
    isAvailable: true,
  },
  {
    id: 'm5',
    categoryId: '2',
    name: 'Dal Makhani',
    description: 'Creamy black lentils slow-cooked overnight with butter and cream',
    price: 13.95,
    imageUrl: dalMakhaniImg,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: 1,
    isAvailable: true,
  },
  {
    id: 'm6',
    categoryId: '2',
    name: 'Chana Masala',
    description: 'Spiced chickpeas in tangy tomato sauce with aromatic spices',
    price: 12.95,
    imageUrl: chanaMasalaImg,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    spiceLevel: 2,
    isAvailable: true,
  },
  // Biryani
  {
    id: 'b1',
    categoryId: '3',
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice layered with spiced chicken and saffron',
    price: 17.95,
    imageUrl: chickenBiryaniImg,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: 2,
    isAvailable: true,
  },
  {
    id: 'b2',
    categoryId: '3',
    name: 'Lamb Biryani',
    description: 'Royal Hyderabadi-style biryani with tender lamb and aromatic spices',
    price: 19.95,
    imageUrl: lambBiryaniImg,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: 2,
    isAvailable: true,
  },
  {
    id: 'b3',
    categoryId: '3',
    name: 'Vegetable Biryani',
    description: 'Basmati rice with seasonal vegetables, nuts, and saffron',
    price: 14.95,
    imageUrl: vegetableBiryaniImg,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    spiceLevel: 1,
    isAvailable: true,
  },
  // Breads
  {
    id: 'br1',
    categoryId: '4',
    name: 'Garlic Naan',
    description: 'Fluffy naan bread topped with fresh garlic and butter',
    price: 3.95,
    imageUrl: garlicNaanImg,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: 0,
    isAvailable: true,
  },
  {
    id: 'br2',
    categoryId: '4',
    name: 'Plain Naan',
    description: 'Traditional clay oven-baked bread',
    price: 2.95,
    imageUrl: plainNaanImg,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: 0,
    isAvailable: true,
  },
  {
    id: 'br3',
    categoryId: '4',
    name: 'Cheese Naan',
    description: 'Naan stuffed with melted mozzarella cheese',
    price: 4.50,
    imageUrl: cheeseNaanImg,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: 0,
    isAvailable: true,
  },
  {
    id: 'br4',
    categoryId: '4',
    name: 'Roti',
    description: 'Whole wheat flatbread, healthy and light',
    price: 2.50,
    imageUrl: rotiImg,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    spiceLevel: 0,
    isAvailable: true,
  },
  // Drinks
  {
    id: 'd1',
    categoryId: '5',
    name: 'Mango Lassi',
    description: 'Refreshing yogurt drink blended with sweet Alphonso mango',
    price: 4.95,
    imageUrl: mangoLassiImg,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: 0,
    isAvailable: true,
  },
  {
    id: 'd2',
    categoryId: '5',
    name: 'Sweet Lassi',
    description: 'Traditional sweet yogurt drink with cardamom',
    price: 4.50,
    imageUrl: sweetLassiImg,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: 0,
    isAvailable: true,
  },
  {
    id: 'd3',
    categoryId: '5',
    name: 'Masala Chai',
    description: 'Spiced Indian tea with milk, ginger, and cardamom',
    price: 3.50,
    imageUrl: masalaChaiImg,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: 0,
    isAvailable: true,
  },
  // Desserts
  {
    id: 'ds1',
    categoryId: '6',
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings soaked in rose-flavored sugar syrup',
    price: 5.95,
    imageUrl: gulabJamunImg,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: 0,
    isAvailable: true,
  },
  {
    id: 'ds2',
    categoryId: '6',
    name: 'Kheer',
    description: 'Creamy rice pudding with cardamom, almonds, and saffron',
    price: 5.50,
    imageUrl: kheerImg,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: 0,
    isAvailable: true,
  },
  {
    id: 'ds3',
    categoryId: '6',
    name: 'Mango Kulfi',
    description: 'Traditional Indian ice cream with rich mango flavor',
    price: 5.95,
    imageUrl: mangoKulfiImg,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: 0,
    isAvailable: true,
  },
];

// Upsell items for cart suggestions
export const upsellItems = ['br1', 'd1']; // Garlic Naan and Mango Lassi

export function getMenuItemsByCategory(categoryId: string): MenuItem[] {
  return menuItems.filter(item => item.categoryId === categoryId && item.isAvailable);
}

export function getMenuItem(id: string): MenuItem | undefined {
  return menuItems.find(item => item.id === id);
}
