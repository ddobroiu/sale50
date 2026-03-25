import { MetadataRoute } from 'next';
import { getAllSkus, getCategories } from '@/lib/products';
import { TOP_CITIES, slugify } from '@/lib/locations';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'http://sale50.ro'; // Or the production URL

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/categories',
    '/products',
    '/login',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Category Routes
  const categories = await getCategories();
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/products?category=${encodeURIComponent(cat.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 3. Product Routes (SKU-based)
  // We use a default city slug for indexing, e.g., 'bucuresti' or just /product/SKU if we had that route
  // But wait, our product routes are /:city/product/:sku
  // For SEO, we should index at least one city per product.
  const skus = await getAllSkus();
  const productRoutes = skus.map((sku) => {
    // We can use a consistent city for indexing, like 'bucuresti'
    const defaultCity = slugify('Bucuresti');
    return {
      url: `${baseUrl}/${defaultCity}/product/${sku}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  // 4. Programmatic City Routes
  // Indexing the /:city/products page for all major cities
  const cityRoutes = TOP_CITIES.map((city) => ({
    url: `${baseUrl}/${slugify(city)}/products`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...cityRoutes,
    ...productRoutes,
  ];
}
