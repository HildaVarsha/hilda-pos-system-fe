export type MenuCategoryType = 'STARTERS' | 'MAIN_COURSE' | 'DRINKS' | 'DESSERTS';
export type FoodType = 'VEG' | 'NON_VEG';

export interface Category {
  id: string;
  name: string;
  type: MenuCategoryType;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: string;
  preparationTime: number;
  foodType: FoodType;
  isAvailable: boolean;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuItemInput {
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  preparationTime: number;
  foodType: FoodType;
  categoryId: string;
  isAvailable: boolean;
}

export type UpdateMenuItemInput = Partial<CreateMenuItemInput>;

export interface CreateCategoryInput {
  name: string;
  type: MenuCategoryType;
}
