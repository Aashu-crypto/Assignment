export type Category = 'Tops' | 'Bottoms' | 'Shoes';

export type WardrobeItem = {
  id: string;
  name: string;
  category: Category;
  image: string;
  color: string;
};

export type Stylist = {
  id: string;
  name: string;
  specialty: string;
  price: number;
  rating: number;
  image: string;
  slots: string[];
};

export type Message = {
  id: string;
  text: string;
  sender: 'me' | 'stylist';
  sentAt: string;
};

export type RootStackParamList = {
  Main: undefined;
  Recommendation: { itemId: string };
};

export type MainTabParamList = {
  Wardrobe: undefined;
  Stylists: undefined;
  Chat: undefined;
};
