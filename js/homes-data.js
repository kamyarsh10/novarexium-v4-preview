/* Novarexium v4: homes for sale and rent.
   To add a home: copy one block, give it a new id (NX-104...), put its photos in img/homes/ as
   <name>-800.webp and <name>-1600.webp, and list the <name>s under "photos" (first one is the cover).
   deal: "sale" or "rent". status: "available", "reserved", "sold" or "rented". price in euros (rent = per month).
   Optional: leave out price ("Price on request"), baths or size (hidden); "priceFrom": true shows "From";
   "bedsTo": 3 shows a range such as 2-3 bedrooms.
   features: lift, heating, ac, furnished, metro, concierge, terrace, storage, pool, sea, parking, garden, gym. */
window.NX_HOMES = [
  {
    "id": "NX-103",
    "status": "available",
    "deal": "rent",
    "type": "apartment",
    "beds": 2,
    "baths": 2,
    "city": "Madrid",
    "features": [
      "parking",
      "storage"
    ],
    "added": "2026-11-09",
    "title": {
      "fa": "آپارتمان دوخوابه در شمال مادرید",
      "en": "Two-bedroom flat in north Madrid",
      "es": "Piso de dos dormitorios en el norte de Madrid"
    },
    "text": {
      "fa": "اجاره بلندمدت. دو اتاق خواب و دو سرویس بهداشتی، آشپزخانه کاملاً مجهز، پارکینگ و انباری. در طبقه ششم یک برج، با موقعیت عالی در شمال مادرید.",
      "en": "Long-term rental. Two bedrooms and two bathrooms, a fully equipped kitchen, parking and a storage room. On the sixth floor of a tower, well placed in the north of Madrid.",
      "es": "Alquiler de larga duración. Dos dormitorios y dos baños, cocina totalmente equipada, garaje y trastero. En la sexta planta de una torre, bien situado en el norte de Madrid."
    },
    "photos": [
      "madrid-north"
    ]
  },
  {
    "id": "NX-102",
    "status": "available",
    "deal": "sale",
    "type": "apartment",
    "beds": 2,
    "bedsTo": 3,
    "city": "Madrid",
    "features": [
      "pool",
      "gym",
      "parking",
      "storage",
      "garden"
    ],
    "added": "2026-11-09",
    "title": {
      "fa": "پیش‌فروش آپارتمان‌های دو و سه‌خوابه نوساز در مادرید",
      "en": "New-build two and three-bedroom flats in Madrid, off plan",
      "es": "Obra nueva de dos y tres dormitorios en Madrid, sobre plano"
    },
    "text": {
      "fa": "پروژه نوساز در منطقه‌ای جدید و رو‌به‌رشد در مادرید، از سازنده‌ای با بیش از ۲۰ سال سابقه ساخت‌وساز در اسپانیا. پیش‌پرداخت ۳۰٪ و تحویل در سال ۲۰۲۸. دارای استخر، باشگاه ورزشی، پارکینگ، انباری و فضای سبز.",
      "en": "A new development in a growing new district of Madrid, by a builder with more than 20 years of building in Spain. 30% down payment, with handover in 2028. Pool, gym, parking, storage room and gardens.",
      "es": "Promoción de obra nueva en una zona nueva y en crecimiento de Madrid, de una constructora con más de 20 años en España. Entrada del 30% y entrega en 2028. Piscina, gimnasio, garaje, trastero y zonas verdes."
    },
    "photos": [
      "madrid-newbuild"
    ]
  },
  {
    "id": "NX-101",
    "status": "available",
    "deal": "rent",
    "type": "apartment",
    "price": 1700,
    "priceFrom": true,
    "beds": 2,
    "city": "Madrid",
    "features": [
      "furnished"
    ],
    "added": "2026-11-09",
    "title": {
      "fa": "آپارتمان دوخوابه مبله در مادرید",
      "en": "Furnished two-bedroom flat in Madrid",
      "es": "Piso amueblado de dos dormitorios en Madrid"
    },
    "text": {
      "fa": "آپارتمان دوخوابه، کاملاً مبله و آماده سکونت. هزینه آب، برق و اینترنت در اجاره ماهانه گنجانده شده است. مناسب برای خانواده‌ها، دانشجویان و افراد شاغل.",
      "en": "A fully furnished two-bedroom flat, ready to move in. Water, electricity and internet are included in the monthly rent. Suits families, students and working professionals.",
      "es": "Piso de dos dormitorios totalmente amueblado y listo para entrar a vivir. Agua, luz e internet incluidos en el alquiler. Ideal para familias, estudiantes o profesionales."
    },
    "photos": [
      "madrid-furnished"
    ]
  }
];
