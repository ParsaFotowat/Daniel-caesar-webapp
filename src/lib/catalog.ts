import heroImage from "@/assets/meridian-hero.jpg";
import collectionImage from "@/assets/collection-showroom.jpg";
import movementImage from "@/assets/movement-macro.jpg";
import journalImage from "@/assets/watchmaker-journal.jpg";

export type Locale = "en" | "fa";
export type Localized = { en: string; fa: string };

export type Watch = {
  slug: string;
  name: string;
  collection: Localized;
  style: "Dress" | "Sport" | "Chronograph" | "Skeleton";
  price: string;
  description: Localized;
  image: string;
  specs: { label: Localized; value: Localized }[];
  features: string[];
};

export type ShowroomCategory = {
  label: Localized;
  detail: Localized;
  image: string;
  imagePosition?: string;
};

export const watches: Watch[] = [
  {
    slug: "meridian-41",
    name: "Meridian 41",
    collection: { en: "Meridian Collection", fa: "مجموعه مریدین" },
    style: "Dress",
    price: "€4,280",
    description: { en: "A study of restraint, finished in deep navy and measured in quiet light.", fa: "مطالعه‌ای در خویشتن‌داری؛ با پرداخت آبی عمیق و سنجیده در نوری آرام." },
    image: heroImage,
    features: ["Automatic", "72h reserve", "Titanium", "Sapphire"],
    specs: [
      { label: { en: "Case", fa: "قاب" }, value: { en: "41 mm titanium", fa: "تیتانیوم ۴۱ میلی‌متری" } },
      { label: { en: "Movement", fa: "موتور" }, value: { en: "DC-01 automatic", fa: "اتوماتیک DC-01" } },
      { label: { en: "Reserve", fa: "ذخیره نیرو" }, value: { en: "72 hours", fa: "۷۲ ساعت" } },
      { label: { en: "Water", fa: "مقاومت آب" }, value: { en: "100 metres", fa: "۱۰۰ متر" } },
    ],
  },
  {
    slug: "aurelius-38",
    name: "Aurelius 38",
    collection: { en: "Aurelius Collection", fa: "مجموعه اورلیوس" },
    style: "Dress",
    price: "€3,850",
    description: { en: "An ivory dial and slim profile for formal, unhurried moments.", fa: "صفحه عاجی و بدنه باریک برای لحظه‌های رسمی و بی‌شتاب." },
    image: collectionImage,
    features: ["Automatic", "Slim case", "Sapphire"],
    specs: [
      { label: { en: "Case", fa: "قاب" }, value: { en: "38 mm steel", fa: "استیل ۳۸ میلی‌متری" } },
      { label: { en: "Movement", fa: "موتور" }, value: { en: "DC-02 automatic", fa: "اتوماتیک DC-02" } },
      { label: { en: "Reserve", fa: "ذخیره نیرو" }, value: { en: "48 hours", fa: "۴۸ ساعت" } },
      { label: { en: "Water", fa: "مقاومت آب" }, value: { en: "50 metres", fa: "۵۰ متر" } },
    ],
  },
  {
    slug: "voyager-42",
    name: "Voyager 42",
    collection: { en: "Voyager Collection", fa: "مجموعه وویجر" },
    style: "Sport",
    price: "€4,950",
    description: { en: "A steel sports watch engineered for daily depth and distance.", fa: "ساعتی اسپرت از جنس استیل، مهندسی‌شده برای عمق و مسیر روزانه." },
    image: collectionImage,
    features: ["Automatic", "Ceramic", "300m water", "Sapphire"],
    specs: [
      { label: { en: "Case", fa: "قاب" }, value: { en: "42 mm steel", fa: "استیل ۴۲ میلی‌متری" } },
      { label: { en: "Movement", fa: "موتور" }, value: { en: "DC-03 automatic", fa: "اتوماتیک DC-03" } },
      { label: { en: "Reserve", fa: "ذخیره نیرو" }, value: { en: "60 hours", fa: "۶۰ ساعت" } },
      { label: { en: "Water", fa: "مقاومت آب" }, value: { en: "300 metres", fa: "۳۰۰ متر" } },
    ],
  },
  {
    slug: "vesper-chronograph",
    name: "Vesper Chronograph",
    collection: { en: "Vesper Collection", fa: "مجموعه وسپر" },
    style: "Chronograph",
    price: "€5,600",
    description: { en: "A column-wheel chronograph with measured contrast and tactile control.", fa: "کرنوگراف چرخ‌ستونی با کنتراست سنجیده و کنترل ملموس." },
    image: collectionImage,
    features: ["Chronograph", "Automatic", "Ceramic", "Sapphire"],
    specs: [
      { label: { en: "Case", fa: "قاب" }, value: { en: "42 mm steel", fa: "استیل ۴۲ میلی‌متری" } },
      { label: { en: "Movement", fa: "موتور" }, value: { en: "DC-C1 automatic", fa: "اتوماتیک DC-C1" } },
      { label: { en: "Reserve", fa: "ذخیره نیرو" }, value: { en: "60 hours", fa: "۶۰ ساعت" } },
      { label: { en: "Water", fa: "مقاومت آب" }, value: { en: "100 metres", fa: "۱۰۰ متر" } },
    ],
  },
  {
    slug: "nocturne-skeleton",
    name: "Nocturne Skeleton",
    collection: { en: "Nocturne Collection", fa: "مجموعه نوکتورن" },
    style: "Skeleton",
    price: "€6,900",
    description: { en: "An open-worked calibre exposing the rhythm beneath the dial.", fa: "کالیبری اسکلتون که ریتم پنهان زیر صفحه را آشکار می‌کند." },
    image: movementImage,
    features: ["Skeleton", "Manual wind", "Sapphire"],
    specs: [
      { label: { en: "Case", fa: "قاب" }, value: { en: "40 mm titanium", fa: "تیتانیوم ۴۰ میلی‌متری" } },
      { label: { en: "Movement", fa: "موتور" }, value: { en: "DC-S1 manual", fa: "دستی DC-S1" } },
      { label: { en: "Reserve", fa: "ذخیره نیرو" }, value: { en: "55 hours", fa: "۵۵ ساعت" } },
      { label: { en: "Water", fa: "مقاومت آب" }, value: { en: "50 metres", fa: "۵۰ متر" } },
    ],
  },
];

export const showroomCategories: ShowroomCategory[] = [
  {
    label: { en: "Dress", fa: "رسمی" },
    detail: { en: "2 timepieces", fa: "۲ ساعت" },
    image: collectionImage,
    imagePosition: "24% center",
  },
  {
    label: { en: "Chronograph", fa: "کرنوگراف" },
    detail: { en: "Measured performance", fa: "عملکرد دقیق" },
    image: collectionImage,
    imagePosition: "72% center",
  },
  {
    label: { en: "Classic", fa: "کلاسیک" },
    detail: { en: "Quiet proportions", fa: "تناسبی آرام" },
    image: heroImage,
    imagePosition: "43% center",
  },
  {
    label: { en: "Sport", fa: "اسپرت" },
    detail: { en: "Built for depth", fa: "ساخته‌شده برای عمق" },
    image: collectionImage,
    imagePosition: "54% center",
  },
  {
    label: { en: "Skeleton", fa: "اسکلتون" },
    detail: { en: "The calibre revealed", fa: "نمایش کالیبر" },
    image: movementImage,
    imagePosition: "center",
  },
  {
    label: { en: "Automatic", fa: "اتوماتیک" },
    detail: { en: "Mechanical precision", fa: "دقت مکانیکی" },
    image: heroImage,
    imagePosition: "67% center",
  },
];

export const assets = { heroImage, collectionImage, movementImage, journalImage };
