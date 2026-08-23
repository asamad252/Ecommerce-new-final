import { createClient } from "@/lib/supabase/server";

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  product_id?: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  category_id: number | null;
  brand_id: number | null;
  categories?: { name: string; slug?: string } | { name: string; slug?: string }[] | null;
  brands?: { name: string; slug?: string } | { name: string; slug?: string }[] | null;
  product_images: ProductImage[];
}

export const SEED_CATEGORIES: Category[] = [
  { id: 1, name: "Consoles", slug: "consoles", parent_id: null },
  { id: 2, name: "PlayStation", slug: "playstation", parent_id: 1 },
  { id: 3, name: "Xbox", slug: "xbox", parent_id: 1 },
  { id: 4, name: "Nintendo", slug: "nintendo", parent_id: 1 },
  { id: 5, name: "Gaming PCs", slug: "gaming-pcs", parent_id: null },
  { id: 6, name: "Prebuilt Rigs", slug: "prebuilt-rigs", parent_id: 5 },
  { id: 7, name: "Graphics Cards", slug: "graphics-cards", parent_id: null },
  { id: 8, name: "NVIDIA RTX", slug: "nvidia-rtx", parent_id: 7 },
  { id: 9, name: "Keyboards", slug: "keyboards", parent_id: null },
  { id: 10, name: "Mechanical", slug: "mechanical-keyboards", parent_id: 9 },
  { id: 11, name: "Wireless Keyboards", slug: "wireless-keyboards", parent_id: 9 },
  { id: 12, name: "Mice", slug: "mice", parent_id: null },
  { id: 13, name: "Headsets", slug: "headsets", parent_id: null },
  { id: 14, name: "Monitors", slug: "monitors", parent_id: null },
  { id: 15, name: "Accessories", slug: "accessories", parent_id: null },
  { id: 16, name: "Digital Games & Codes", slug: "digital-codes", parent_id: null },
];

export const SEED_BRANDS: Brand[] = [
  { id: 1, name: "Sony", slug: "sony" },
  { id: 2, name: "Microsoft", slug: "microsoft" },
  { id: 3, name: "Nintendo", slug: "nintendo" },
  { id: 4, name: "NVIDIA", slug: "nvidia" },
  { id: 5, name: "ASUS ROG", slug: "asus" },
  { id: 6, name: "MSI", slug: "msi" },
  { id: 7, name: "Logitech G", slug: "logitech" },
  { id: 8, name: "Razer", slug: "razer" },
  { id: 9, name: "SteelSeries", slug: "steelseries" },
  { id: 10, name: "Corsair", slug: "corsair" },
  { id: 11, name: "HyperX", slug: "hyperx" },
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "PlayStation 5 Pro Console",
    slug: "playstation-5-pro-console",
    description: "Experience next-level gaming with enhanced ray tracing, ultra-crisp 4K fidelity at high framerates, and a 2TB high-speed NVMe SSD.",
    price: 219999,
    compare_at_price: 239999,
    stock: 14,
    is_active: true,
    is_featured: true,
    created_at: "2025-01-15T10:00:00Z",
    category_id: 1,
    brand_id: 1,
    categories: { name: "Consoles", slug: "consoles" },
    brands: { name: "Sony", slug: "sony" },
    product_images: [
      {
        id: 101,
        image_url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80",
        alt_text: "PlayStation 5 Pro Console",
        sort_order: 1,
        is_primary: true,
      },
      {
        id: 102,
        image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
        alt_text: "PlayStation Controller",
        sort_order: 2,
        is_primary: false,
      },
    ],
  },
  {
    id: 2,
    name: "Xbox Series X 1TB Console",
    slug: "xbox-series-x-1tb-console",
    description: "The fastest, most powerful Xbox ever. Play thousands of titles from four generations of consoles with Quick Resume and 12 teraflops of graphical power.",
    price: 164999,
    compare_at_price: 179999,
    stock: 9,
    is_active: true,
    is_featured: true,
    created_at: "2025-01-14T12:00:00Z",
    category_id: 1,
    brand_id: 2,
    categories: { name: "Consoles", slug: "consoles" },
    brands: { name: "Microsoft", slug: "microsoft" },
    product_images: [
      {
        id: 201,
        image_url: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=1000&q=80",
        alt_text: "Xbox Series X Console",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: 3,
    name: "Nintendo Switch OLED Model - White",
    slug: "nintendo-switch-oled-white",
    description: "Featuring a vibrant 7-inch OLED screen, wide adjustable stand, enhanced audio, and 64GB of internal storage for gaming on the go or TV.",
    price: 98999,
    compare_at_price: 109999,
    stock: 20,
    is_active: true,
    is_featured: true,
    created_at: "2025-01-13T09:00:00Z",
    category_id: 1,
    brand_id: 3,
    categories: { name: "Consoles", slug: "consoles" },
    brands: { name: "Nintendo", slug: "nintendo" },
    product_images: [
      {
        id: 301,
        image_url: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=80",
        alt_text: "Nintendo Switch OLED",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: 4,
    name: "ASUS ROG Strix GeForce RTX 4080 Super OC 16GB",
    slug: "asus-rog-strix-geforce-rtx-4080-super-oc",
    description: "Extreme cooling with Axial-tech fans, premium power delivery, and DLSS 3.5 frame generation technology for maxed-out 4K AAA gaming.",
    price: 385000,
    compare_at_price: 410000,
    stock: 6,
    is_active: true,
    is_featured: true,
    created_at: "2025-01-12T14:00:00Z",
    category_id: 7,
    brand_id: 5,
    categories: { name: "Graphics Cards", slug: "graphics-cards" },
    brands: { name: "ASUS ROG", slug: "asus" },
    product_images: [
      {
        id: 401,
        image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80",
        alt_text: "ASUS ROG Strix GeForce RTX 4080 Super",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: 5,
    name: "NVIDIA GeForce RTX 4090 Founders Edition 24GB",
    slug: "nvidia-geforce-rtx-4090-fe",
    description: "The ultimate GPU powerhouse built with Ada Lovelace architecture, 24GB of ultra-fast G6X memory, and unmatched ray tracing performance.",
    price: 589999,
    compare_at_price: 620000,
    stock: 3,
    is_active: true,
    is_featured: true,
    created_at: "2025-01-11T16:00:00Z",
    category_id: 7,
    brand_id: 4,
    categories: { name: "Graphics Cards", slug: "graphics-cards" },
    brands: { name: "NVIDIA", slug: "nvidia" },
    product_images: [
      {
        id: 501,
        image_url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80",
        alt_text: "NVIDIA GeForce RTX 4090",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: 6,
    name: "Razer Huntsman V3 Pro Analog Optical Keyboard",
    slug: "razer-huntsman-v3-pro-analog",
    description: "Rapid Trigger mode with adjustable 0.1–4.0mm actuation, textured doubleshot PBT keycaps, brushed aluminum top plate, and dedicated media controls.",
    price: 68500,
    compare_at_price: 75000,
    stock: 18,
    is_active: true,
    is_featured: true,
    created_at: "2025-01-10T11:00:00Z",
    category_id: 9,
    brand_id: 8,
    categories: { name: "Keyboards", slug: "keyboards" },
    brands: { name: "Razer", slug: "razer" },
    product_images: [
      {
        id: 601,
        image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
        alt_text: "Razer Huntsman V3 Pro",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: 7,
    name: "Logitech G Pro X Superlight 2 Wireless Gaming Mouse",
    slug: "logitech-g-pro-x-superlight-2",
    description: "60g ultra-lightweight championship design, HERO 2 sensor with 32,000 DPI, LIGHTFORCE hybrid optical-mechanical switches, and 95 hours of battery.",
    price: 42999,
    compare_at_price: 48000,
    stock: 25,
    is_active: true,
    is_featured: true,
    created_at: "2025-01-09T15:00:00Z",
    category_id: 12,
    brand_id: 7,
    categories: { name: "Mice", slug: "mice" },
    brands: { name: "Logitech G", slug: "logitech" },
    product_images: [
      {
        id: 701,
        image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80",
        alt_text: "Logitech G Pro X Superlight 2",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: 8,
    name: "SteelSeries Arctis Nova Pro Wireless Headset",
    slug: "steelseries-arctis-nova-pro-wireless",
    description: "Almighty audio system with active noise cancellation, dual wireless connectivity (2.4GHz + Bluetooth), infinity power system with swappable batteries.",
    price: 95000,
    compare_at_price: 105000,
    stock: 11,
    is_active: true,
    is_featured: true,
    created_at: "2025-01-08T13:00:00Z",
    category_id: 13,
    brand_id: 9,
    categories: { name: "Headsets", slug: "headsets" },
    brands: { name: "SteelSeries", slug: "steelseries" },
    product_images: [
      {
        id: 801,
        image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
        alt_text: "SteelSeries Arctis Nova Pro Wireless",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: 9,
    name: "ASUS ROG Swift OLED 27\" 240Hz Gaming Monitor",
    slug: "asus-rog-swift-oled-27-240hz",
    description: "QHD (2560x1440) OLED panel with 0.03ms response time, 240Hz refresh rate, 99% DCI-P3 color gamut, and custom heatsink for heat dissipation.",
    price: 289000,
    compare_at_price: 315000,
    stock: 7,
    is_active: true,
    is_featured: false,
    created_at: "2025-01-07T10:00:00Z",
    category_id: 14,
    brand_id: 5,
    categories: { name: "Monitors", slug: "monitors" },
    brands: { name: "ASUS ROG", slug: "asus" },
    product_images: [
      {
        id: 901,
        image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
        alt_text: "ASUS ROG Swift Gaming Monitor",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: 10,
    name: "NexGear Beast Core i9 RTX 4090 Prebuilt PC",
    slug: "nexgear-beast-core-i9-rtx-4090",
    description: "Intel Core i9-14900KF, NVIDIA RTX 4090 24GB, 64GB DDR5 6000MHz RAM, 2TB Gen4 NVMe SSD, 360mm AIO liquid cooling in tempered glass case.",
    price: 1150000,
    compare_at_price: 1250000,
    stock: 4,
    is_active: true,
    is_featured: true,
    created_at: "2025-01-06T18:00:00Z",
    category_id: 5,
    brand_id: 5,
    categories: { name: "Gaming PCs", slug: "gaming-pcs" },
    brands: { name: "ASUS ROG", slug: "asus" },
    product_images: [
      {
        id: 1001,
        image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80",
        alt_text: "Gaming PC Rigs",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: 11,
    name: "Steam Wallet $50 Global Digital Gift Code",
    slug: "steam-wallet-50-dollar-global",
    description: "Instant delivery digital gift card code redeemable on Steam globally for games, downloadable content, and in-game cosmetics.",
    price: 14500,
    compare_at_price: 15500,
    stock: 50,
    is_active: true,
    is_featured: false,
    created_at: "2025-01-05T08:00:00Z",
    category_id: 16,
    brand_id: null,
    categories: { name: "Digital Games & Codes", slug: "digital-codes" },
    brands: null,
    product_images: [
      {
        id: 1101,
        image_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80",
        alt_text: "Steam Digital Gift Code",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: 12,
    name: "PlayStation Store $50 US Digital Gift Card",
    slug: "playstation-store-50-dollar-digital",
    description: "Instantly unlock PlayStation games, add-ons, subscriptions, and movies on PS5, PS4, and Web store.",
    price: 14800,
    compare_at_price: null,
    stock: 45,
    is_active: true,
    is_featured: false,
    created_at: "2025-01-04T12:00:00Z",
    category_id: 16,
    brand_id: 1,
    categories: { name: "Digital Games & Codes", slug: "digital-codes" },
    brands: { name: "Sony", slug: "sony" },
    product_images: [
      {
        id: 1201,
        image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
        alt_text: "PlayStation Store Gift Card",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: 13,
    name: "Logitech G Pro X TKL Lightspeed Wireless Keyboard",
    slug: "logitech-g-pro-x-tkl-lightspeed",
    description: "Tenkeyless esports wireless keyboard with GX mechanical switches, LIGHTSYNC RGB, PBT keycaps, and tournament-grade wireless reliability.",
    price: 54999,
    compare_at_price: null,
    stock: 15,
    is_active: true,
    is_featured: false,
    created_at: "2025-01-03T14:00:00Z",
    category_id: 9,
    brand_id: 7,
    categories: { name: "Keyboards", slug: "keyboards" },
    brands: { name: "Logitech G", slug: "logitech" },
    product_images: [
      {
        id: 1301,
        image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
        alt_text: "Logitech G Pro X Keyboard",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: 14,
    name: "HyperX Cloud III Wireless Gaming Headset",
    slug: "hyperx-cloud-iii-wireless",
    description: "Legendary comfort with signature memory foam, re-engineered 53mm angled drivers, ultra-clear 10mm microphone, and up to 120 hours of battery life.",
    price: 46999,
    compare_at_price: 52000,
    stock: 19,
    is_active: true,
    is_featured: false,
    created_at: "2025-01-02T10:00:00Z",
    category_id: 13,
    brand_id: 11,
    categories: { name: "Headsets", slug: "headsets" },
    brands: { name: "HyperX", slug: "hyperx" },
    product_images: [
      {
        id: 1401,
        image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
        alt_text: "HyperX Cloud III Wireless",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: 15,
    name: "MSI GeForce RTX 4070 Ti Super 16GB Gaming X Slim",
    slug: "msi-geforce-rtx-4070-ti-super-16gb",
    description: "TRI FROZR 3 thermal design with TORX Fan 5.0, high-speed 16GB GDDR6X VRAM, and compact slim 2.5-slot profile for maximum chassis compatibility.",
    price: 265000,
    compare_at_price: 289000,
    stock: 8,
    is_active: true,
    is_featured: false,
    created_at: "2025-01-01T15:00:00Z",
    category_id: 7,
    brand_id: 6,
    categories: { name: "Graphics Cards", slug: "graphics-cards" },
    brands: { name: "MSI", slug: "msi" },
    product_images: [
      {
        id: 1501,
        image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80",
        alt_text: "MSI RTX 4070 Ti Super",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
];

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return false;
  if (url.includes("placeholder") || url.includes("example.com")) return false;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname) return false;
    return true;
  } catch {
    return false;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          description,
          price,
          compare_at_price,
          stock,
          is_active,
          is_featured,
          created_at,
          category_id,
          brand_id,
          categories (
            name,
            slug
          ),
          brands (
            name,
            slug
          ),
          product_images (
            id,
            image_url,
            alt_text,
            sort_order,
            is_primary
          )
        `)
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(8);

      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    } catch {
      // Fallback below
    }
  }

  return SEED_PRODUCTS.filter((p) => p.is_featured);
}

export async function getDealsProducts(limit = 12): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          description,
          price,
          compare_at_price,
          stock,
          is_active,
          is_featured,
          created_at,
          category_id,
          brand_id,
          categories (
            name,
            slug
          ),
          brands (
            name,
            slug
          ),
          product_images (
            id,
            image_url,
            alt_text,
            sort_order,
            is_primary
          )
        `)
        .eq("is_active", true)
        .not("compare_at_price", "is", null)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        const filtered = (data as Product[]).filter(
          (p) => p.compare_at_price !== null && Number(p.compare_at_price) > Number(p.price)
        );
        if (filtered.length > 0) return filtered;
      }
    } catch {
      // Fallback below
    }
  }

  return SEED_PRODUCTS.filter(
    (p) => p.compare_at_price !== null && Number(p.compare_at_price) > Number(p.price)
  ).slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, parent_id")
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch {
      // Fallback below
    }
  }

  return SEED_CATEGORIES;
}

export async function getBrands(): Promise<Brand[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("brands")
        .select("id, name, slug")
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Brand[];
      }
    } catch {
      // Fallback below
    }
  }

  return SEED_BRANDS;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          description,
          price,
          compare_at_price,
          stock,
          is_active,
          is_featured,
          created_at,
          category_id,
          brand_id,
          categories (
            name,
            slug
          ),
          brands (
            name,
            slug
          ),
          product_images (
            id,
            image_url,
            alt_text,
            sort_order,
            is_primary
          )
        `)
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (!error && data) {
        return data as Product;
      }
    } catch {
      // Fallback below
    }
  }

  const found = SEED_PRODUCTS.find((p) => p.slug === slug);
  return found || null;
}

export async function getShopProducts(options: {
  search?: string;
  category?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  brand?: string;
  inStock?: string;
}): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          description,
          price,
          compare_at_price,
          stock,
          is_active,
          is_featured,
          created_at,
          category_id,
          brand_id,
          categories (
            name,
            slug
          ),
          brands (
            name,
            slug
          ),
          product_images (
            id,
            image_url,
            alt_text,
            sort_order,
            is_primary
          )
        `)
        .eq("is_active", true);

      if (options.search?.trim()) {
        const term = options.search.trim();
        query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
      }

      if (options.category) {
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", options.category)
          .maybeSingle();
        if (cat) {
          query = query.eq("category_id", cat.id);
        }
      }

      if (options.minPrice) {
        const min = Number(options.minPrice);
        if (!Number.isNaN(min)) query = query.gte("price", min);
      }

      if (options.maxPrice) {
        const max = Number(options.maxPrice);
        if (!Number.isNaN(max)) query = query.lte("price", max);
      }

      if (options.brand) {
        const { data: br } = await supabase
          .from("brands")
          .select("id")
          .eq("slug", options.brand)
          .maybeSingle();
        if (br) {
          query = query.eq("brand_id", br.id);
        }
      }

      if (options.inStock === "true") {
        query = query.gt("stock", 0);
      }

      switch (options.sort) {
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "name-asc":
          query = query.order("name", { ascending: true });
          break;
        default:
          query = query.order("created_at", { ascending: false });
          break;
      }

      const { data, error } = await query.limit(30);
      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    } catch {
      // Fallback below
    }
  }

  // Filter seed products
  let results = [...SEED_PRODUCTS].filter((p) => p.is_active);

  if (options.search?.trim()) {
    const term = options.search.trim().toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
    );
  }

  if (options.category) {
    const catSlug = options.category.toLowerCase();
    const matchedCategory = SEED_CATEGORIES.find((c) => c.slug === catSlug);
    if (matchedCategory) {
      // Include child categories if it's a parent
      const childCatIds = SEED_CATEGORIES.filter((c) => c.parent_id === matchedCategory.id).map((c) => c.id);
      const allowedCategoryIds = [matchedCategory.id, ...childCatIds];
      results = results.filter((p) => p.category_id !== null && allowedCategoryIds.includes(p.category_id));
    }
  }

  if (options.brand) {
    const brandSlug = options.brand.toLowerCase();
    const matchedBrand = SEED_BRANDS.find((b) => b.slug === brandSlug);
    if (matchedBrand) {
      results = results.filter((p) => p.brand_id === matchedBrand.id);
    }
  }

  if (options.minPrice) {
    const min = Number(options.minPrice);
    if (!Number.isNaN(min)) {
      results = results.filter((p) => p.price >= min);
    }
  }

  if (options.maxPrice) {
    const max = Number(options.maxPrice);
    if (!Number.isNaN(max)) {
      results = results.filter((p) => p.price <= max);
    }
  }

  if (options.inStock === "true") {
    results = results.filter((p) => p.stock > 0);
  }

  switch (options.sort) {
    case "price-asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
  }

  return results;
}
