import { Message, Stylist, WardrobeItem } from './types';

export const wardrobeSeed: WardrobeItem[] = [
  {
    id: 'top-1',
    name: 'Linen Overshirt',
    category: 'Tops',
    color: '#D5C8B8',
    image:
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'bottom-1',
    name: 'Relaxed Trousers',
    category: 'Bottoms',
    color: '#283039',
    image:
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'shoes-1',
    name: 'Retro Runners',
    category: 'Shoes',
    color: '#E7E2DA',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'top-2',
    name: 'Everyday Tee',
    category: 'Tops',
    color: '#7D8A77',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'bottom-2',
    name: 'Light Wash Denim',
    category: 'Bottoms',
    color: '#8BA0B8',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'shoes-2',
    name: 'Leather Loafers',
    category: 'Shoes',
    color: '#4C2F25',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=85',
  },
];

export const stylists: Stylist[] = [
  {
    id: 'maya',
    name: 'Maya Chen',
    specialty: 'Minimal & effortless',
    price: 45,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=85',
    slots: ['Today · 6:30 PM', 'Wed · 11:00 AM', 'Thu · 2:30 PM'],
  },
  {
    id: 'jules',
    name: 'Jules Carter',
    specialty: 'Streetwear & vintage',
    price: 55,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=85',
    slots: ['Wed · 4:00 PM', 'Fri · 10:30 AM', 'Sat · 1:00 PM'],
  },
  {
    id: 'amara',
    name: 'Amara Okafor',
    specialty: 'Color & occasion',
    price: 60,
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=85',
    slots: ['Thu · 5:30 PM', 'Fri · 3:00 PM', 'Sun · 12:00 PM'],
  },
];

export const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hey! I looked through your wardrobe. The linen overshirt is a great anchor piece.',
    sender: 'stylist',
    sentAt: '10:24 AM',
  },
  {
    id: '2',
    text: 'Love that one. Could it work for a casual dinner?',
    sender: 'me',
    sentAt: '10:26 AM',
  },
  {
    id: '3',
    text: 'Definitely. Pair it with the dark trousers and loafers—relaxed, but still intentional.',
    sender: 'stylist',
    sentAt: '10:27 AM',
  },
];
