import heroImage from "@/assets/meridian-hero.jpg";
import collectionImage from "@/assets/collection-showroom.jpg";
import movementImage from "@/assets/movement-macro.jpg";
import journalImage from "@/assets/watchmaker-journal.jpg";
import dialDetailImage from "@/assets/dial-detail.jpg";
import calibreDetailImage from "@/assets/calibre-detail.jpg";

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
  story: Localized;
  details: { key: "dial" | "case" | "movement" | "crystal" | "water"; label: Localized; description: Localized }[];
};

const detailLabels = {
  dial: { en: "Dial", fa: "صفحه" },
  case: { en: "Case", fa: "قاب" },
  movement: { en: "Movement", fa: "موتور" },
  crystal: { en: "Crystal", fa: "شیشه" },
  water: { en: "Water resistance", fa: "مقاومت در برابر آب" },
};

const detailSet = (values: Record<keyof typeof detailLabels, Localized>): Watch["details"] =>
  (Object.keys(detailLabels) as (keyof typeof detailLabels)[]).map((key) => ({ key, label: detailLabels[key], description: values[key] }));

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
    story: { en: "The Meridian balances a textured midnight dial with a light titanium architecture—an everyday calibre reduced to its purest lines.", fa: "مریدین صفحه‌ای بافت‌دار به رنگ نیمه‌شب را با معماری سبک تیتانیومی همراه می‌کند؛ کالیبری روزمره که به خالص‌ترین خطوط خود رسیده است." },
    details: detailSet({ dial: { en: "Deep navy guilloché catches light without glare.", fa: "گیوشه آبی عمیق، نور را بدون درخشش زننده جذب می‌کند." }, case: { en: "Grade 5 titanium, alternately brushed and polished.", fa: "تیتانیوم گرید ۵ با پرداخت برس‌خورده و صیقلی متناوب." }, movement: { en: "DC-01 automatic calibre with a 72-hour reserve.", fa: "کالیبر اتوماتیک DC-01 با ۷۲ ساعت ذخیره نیرو." }, crystal: { en: "Box sapphire with anti-reflective inner coating.", fa: "شیشه یاقوت کبود با پوشش ضدبازتاب داخلی." }, water: { en: "Sealed and pressure-tested to 100 metres.", fa: "آب‌بندی و آزموده‌شده تا عمق ۱۰۰ متر." } }),
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
    story: { en: "Aurelius is defined by proportion: a slim steel case, warm ivory dial and a restrained profile for formal hours.", fa: "اورلیوس با تناسب تعریف می‌شود؛ قاب باریک استیل، صفحه عاجی گرم و فرمی آرام برای ساعت‌های رسمی." },
    details: detailSet({ dial: { en: "Warm ivory lacquer with slender applied markers.", fa: "لاک عاجی گرم با نشانگرهای باریک برجسته." }, case: { en: "A compact 38 mm steel case with a fine polished bezel.", fa: "قاب جمع‌وجور ۳۸ میلی‌متری استیل با بزل ظریف صیقلی." }, movement: { en: "Slim DC-02 automatic calibre, tuned for daily wear.", fa: "کالیبر باریک اتوماتیک DC-02، تنظیم‌شده برای استفاده روزانه." }, crystal: { en: "Domed sapphire preserves its classically curved profile.", fa: "یاقوت کبود گنبدی، فرم کلاسیک و منحنی ساعت را حفظ می‌کند." }, water: { en: "Protected to 50 metres for refined daily use.", fa: "مقاوم تا ۵۰ متر برای استفاده روزمره ظریف." } }),
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
    story: { en: "Voyager brings robust engineering into a clean silhouette, built for depth, travel and constant use.", fa: "وویجر مهندسی مقاوم را در فرمی پاک ارائه می‌کند؛ ساخته‌شده برای عمق، سفر و استفاده مداوم." },
    details: detailSet({ dial: { en: "High-contrast markers remain legible in low light.", fa: "نشانگرهای پرکنتراست در نور کم نیز خوانا می‌مانند." }, case: { en: "A protective 42 mm steel shell with crown guards.", fa: "پوسته محافظ ۴۲ میلی‌متری استیل با محافظ تاج." }, movement: { en: "Shock-resistant DC-03 automatic calibre.", fa: "کالیبر اتوماتیک ضدضربه DC-03." }, crystal: { en: "Thick sapphire engineered for pressure and clarity.", fa: "یاقوت کبود ضخیم، مهندسی‌شده برای فشار و شفافیت." }, water: { en: "Individually pressure-tested to 300 metres.", fa: "هر نمونه به‌صورت جداگانه تا عمق ۳۰۰ متر آزموده می‌شود." } }),
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
    story: { en: "Vesper turns elapsed time into a tactile ritual through crisp pushers, measured contrast and a column-wheel heart.", fa: "وسپر با دکمه‌های دقیق، کنتراست سنجیده و قلب چرخ‌ستونی، زمان‌سنجی را به آیینی ملموس تبدیل می‌کند." },
    details: detailSet({ dial: { en: "Layered registers separate timing data at a glance.", fa: "صفحات فرعی لایه‌دار، اطلاعات زمان‌سنجی را در یک نگاه جدا می‌کنند." }, case: { en: "Sculpted steel balances the pushers and ceramic bezel.", fa: "استیل تراش‌خورده، دکمه‌ها و بزل سرامیکی را متعادل می‌کند." }, movement: { en: "DC-C1 column-wheel chronograph with vertical clutch.", fa: "کرنوگراف چرخ‌ستونی DC-C1 با کلاچ عمودی." }, crystal: { en: "Flush sapphire keeps the profile controlled and clear.", fa: "یاقوت کبود هم‌سطح، فرم را کنترل‌شده و شفاف نگه می‌دارد." }, water: { en: "Chronograph seals tested to 100 metres.", fa: "آب‌بندی کرنوگراف تا عمق ۱۰۰ متر آزموده شده است." } }),
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
    story: { en: "Nocturne removes the dial to reveal the rhythm beneath it, framing hand-finished bridges in a quiet titanium case.", fa: "نوکتورن صفحه را کنار می‌زند تا ریتم زیر آن آشکار شود و پل‌های پرداخت‌شده با دست را در قاب آرام تیتانیومی نمایش دهد." },
    details: detailSet({ dial: { en: "An open-worked chapter ring frames the moving calibre.", fa: "حلقه ساعت اسکلتون، کالیبر متحرک را قاب می‌گیرد." }, case: { en: "Lightweight 40 mm titanium keeps the mechanics central.", fa: "تیتانیوم سبک ۴۰ میلی‌متری، مکانیک را در مرکز توجه نگه می‌دارد." }, movement: { en: "Hand-wound DC-S1 with visible balance and 55-hour reserve.", fa: "DC-S1 کوکی با بالانس نمایان و ۵۵ ساعت ذخیره نیرو." }, crystal: { en: "Front and rear sapphire create an uninterrupted view.", fa: "یاقوت کبود جلو و پشت، نمایی پیوسته ایجاد می‌کند." }, water: { en: "Sealed to 50 metres without obscuring the calibre.", fa: "آب‌بندی تا ۵۰ متر بدون پوشاندن کالیبر." } }),
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

export const assets = { heroImage, collectionImage, movementImage, journalImage, dialDetailImage, calibreDetailImage };

export type Retailer = { name: string; city: Localized; address: Localized; phone: string; mapQuery: string };

// Placeholder retailers — replace with the real authorised network.
export const retailers: Retailer[] = [
  { name: "Daniel Caesar Boutique", city: { en: "Tehran", fa: "تهران" }, address: { en: "Elahieh, Fereshteh St.", fa: "الهیه، خیابان فرشته" }, phone: "+98 21 0000 0001", mapQuery: "Fereshteh St Tehran" },
  { name: "Kourosh Mall Atelier", city: { en: "Tehran", fa: "تهران" }, address: { en: "Kourosh Mall, Level 2", fa: "مجتمع کوروش، طبقه دوم" }, phone: "+98 21 0000 0002", mapQuery: "Kourosh Mall Tehran" },
  { name: "Isfahan Time House", city: { en: "Isfahan", fa: "اصفهان" }, address: { en: "Chaharbagh Abbasi", fa: "چهارباغ عباسی" }, phone: "+98 31 0000 0003", mapQuery: "Chaharbagh Isfahan" },
  { name: "Shiraz Horology", city: { en: "Shiraz", fa: "شیراز" }, address: { en: "Zand Blvd.", fa: "بلوار زند" }, phone: "+98 71 0000 0004", mapQuery: "Zand Blvd Shiraz" },
  { name: "Dubai Mall Partner", city: { en: "Dubai", fa: "دبی" }, address: { en: "The Dubai Mall, Fashion Ave.", fa: "دبی مال، فشن اونیو" }, phone: "+971 4 000 0005", mapQuery: "Dubai Mall Fashion Avenue" },
];
