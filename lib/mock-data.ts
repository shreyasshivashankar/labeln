export const mockCollections = [
  {
    id: '1',
    title: 'Bridal',
    handle: 'bridal',
    image: {
      url: '/images/bridal.jpg',
      altText: 'Bridal Collection',
    },
  },
  {
    id: '2',
    title: 'Festive',
    handle: 'festive',
    image: {
      url: '/images/festive.jpg',
      altText: 'Festive Collection',
    },
  },
  {
    id: '3',
    title: 'Contemporary',
    handle: 'contemporary',
    image: {
      url: '/images/contemporary.jpg',
      altText: 'Contemporary Collection',
    },
  },
];

export const mockProducts = [
  {
    id: '1',
    title: 'Silk Lehengga',
    handle: 'silk-lehengga',
    priceRange: {
      minVariantPrice: {
        amount: '450.00',
        currencyCode: 'USD',
      },
    },
    images: {
      edges: [
        {
          node: {
            url: '/images/lehengga.jpg',
            altText: 'Silk Lehengga',
          },
        },
      ],
    },
  },
  {
    id: '2',
    title: 'Embroidered Anarkali',
    handle: 'embroidered-anarkali',
    priceRange: {
      minVariantPrice: {
        amount: '380.00',
        currencyCode: 'USD',
      },
    },
    images: {
      edges: [
        {
          node: {
            url: '/images/anarkali.jpg',
            altText: 'Embroidered Anarkali',
          },
        },
      ],
    },
  },
  {
    id: '3',
    title: 'Zardosi Saree Blouse',
    handle: 'zardosi-saree-blouse',
    priceRange: {
      minVariantPrice: {
        amount: '280.00',
        currencyCode: 'USD',
      },
    },
    images: {
      edges: [
        {
          node: {
            url: '/images/saree-blouse.jpg',
            altText: 'Zardosi Saree Blouse',
          },
        },
      ],
    },
  },
  {
    id: '4',
    title: 'Hand-Woven Kurta',
    handle: 'hand-woven-kurta',
    priceRange: {
      minVariantPrice: {
        amount: '220.00',
        currencyCode: 'USD',
      },
    },
    images: {
      edges: [
        {
          node: {
            url: '/images/kurta.jpg',
            altText: 'Hand-Woven Kurta',
          },
        },
      ],
    },
  },
];
