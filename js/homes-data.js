/* Novarexium v4: homes for sale and rent.
   To add a home: copy one block, give it a new id (NX-105...), put its photos in img/homes/ as
   <name>-800.webp and <name>-1600.webp, and list the <name>s under "photos" (first one is the cover).
   deal: "sale" or "rent". status: "available", "reserved", "sold" or "rented". price in euros (rent = per month).
   features: lift, heating, ac, furnished, metro, concierge, terrace, storage, pool, sea, parking, garden.
   The 4 homes below are SAMPLES ("sample": true) and must be removed before real homes go live. */
window.NX_HOMES = [
  {
    "id": "NX-104",
    "sample": true,
    "status": "available",
    "deal": "rent",
    "type": "apartment",
    "price": 2150,
    "beds": 3,
    "baths": 2,
    "size": 118,
    "city": "Madrid",
    "area": "Salamanca",
    "features": [
      "lift",
      "heating",
      "ac",
      "furnished",
      "metro",
      "concierge"
    ],
    "added": "2026-11-04",
    "title": {
      "fa": "آپارتمان سه‌خوابه نزدیک پارک رتیرو",
      "en": "Three-bedroom flat near Retiro Park",
      "es": "Piso de tres habitaciones junto al Retiro"
    },
    "text": {
      "fa": "آپارتمان روشن در ساختمانی کلاسیک با آسانسور و نگهبان. مبله، با گرمایش مرکزی و کولر. چند دقیقه پیاده تا مترو و پارک.",
      "en": "A bright flat in a classic building with lift and concierge. Furnished, with central heating and air conditioning. A few minutes' walk to the metro and the park.",
      "es": "Piso luminoso en un edificio clásico con ascensor y portero. Amueblado, con calefacción central y aire acondicionado. A pocos minutos andando del metro y del parque."
    },
    "photos": [
      "flat-gold",
      "living-modern",
      "bedroom-modern"
    ]
  },
  {
    "id": "NX-103",
    "sample": true,
    "status": "available",
    "deal": "sale",
    "type": "apartment",
    "price": 640000,
    "beds": 2,
    "baths": 2,
    "size": 96,
    "city": "Madrid",
    "area": "Centro",
    "features": [
      "lift",
      "terrace",
      "heating",
      "ac",
      "storage"
    ],
    "added": "2026-11-02",
    "title": {
      "fa": "آپارتمان دوخوابه با بالکن رو به خیابان",
      "en": "Two-bedroom flat with street balconies",
      "es": "Piso de dos habitaciones con balcones a la calle"
    },
    "text": {
      "fa": "در یکی از ساختمان‌های قدیمی مرکز شهر، با سقف بلند، بالکن‌های فرفورژه و انباری. بازسازی‌شده و آماده سکونت.",
      "en": "In one of the old buildings of the city centre, with high ceilings, wrought-iron balconies and a storage room. Renovated and ready to move in.",
      "es": "En un edificio antiguo del centro, con techos altos, balcones de forja y trastero. Reformado y listo para entrar a vivir."
    },
    "photos": [
      "flat-granada-2",
      "flat-granada",
      "bedroom-modern"
    ]
  },
  {
    "id": "NX-102",
    "sample": true,
    "status": "reserved",
    "deal": "sale",
    "type": "apartment",
    "price": 385000,
    "beds": 2,
    "baths": 1,
    "size": 82,
    "city": "Marbella",
    "area": "Costa del Sol",
    "features": [
      "pool",
      "terrace",
      "sea",
      "ac",
      "parking"
    ],
    "added": "2026-10-28",
    "title": {
      "fa": "آپارتمان کنار دریا در کوستا دل سول",
      "en": "Seafront flat on the Costa del Sol",
      "es": "Piso en primera línea en la Costa del Sol"
    },
    "text": {
      "fa": "روبه‌روی ساحل، با تراس، استخر مشاع و پارکینگ. مناسب برای زندگی آرام یا اجاره فصلی.",
      "en": "Facing the beach, with a terrace, shared pool and parking. Suits a quiet life or seasonal letting.",
      "es": "Frente a la playa, con terraza, piscina comunitaria y garaje. Ideal para vivir tranquilo o para alquiler de temporada."
    },
    "photos": [
      "puerto-banus",
      "living-modern",
      "bedroom-modern"
    ]
  },
  {
    "id": "NX-101",
    "sample": true,
    "status": "rented",
    "deal": "rent",
    "type": "apartment",
    "price": 1650,
    "beds": 2,
    "baths": 1,
    "size": 74,
    "city": "Madrid",
    "area": "Castellana",
    "features": [
      "lift",
      "heating",
      "metro",
      "furnished"
    ],
    "added": "2026-10-15",
    "title": {
      "fa": "آپارتمان مبله نزدیک برج‌های کاستیانا",
      "en": "Furnished flat near the Castellana towers",
      "es": "Piso amueblado junto a las torres de la Castellana"
    },
    "text": {
      "fa": "مبله و آماده، با آسانسور و گرمایش. نزدیک خط مترو و مراکز کاری شمال مادرید.",
      "en": "Furnished and ready, with lift and heating. Close to the metro and the business district in the north of Madrid.",
      "es": "Amueblado y listo, con ascensor y calefacción. Cerca del metro y de la zona de negocios del norte de Madrid."
    },
    "photos": [
      "living-modern",
      "flat-gold",
      "bedroom-modern"
    ]
  }
];
