// store/useCategoriesStore.ts
import { create } from "zustand";

export interface CategoriesSlice {
  categories: Array<{category:string,slug:string}>;
  setCategories: (categories: Array<{category:string,slug:string}>) => void;
}

const useCategoriesStore = create<CategoriesSlice>((set) => ({
  categories: [],
  setCategories: (categories: Array<{category:string,slug:string}>) => set({ categories }),
}));

export default useCategoriesStore;
