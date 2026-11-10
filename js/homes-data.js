/* Novarexium v4: homes for sale and rent.
   To add a home: copy one block, give it a new id (NX-104...), put its photos in img/homes/ as
   <name>-800.webp and <name>-1600.webp, and list the <name>s under "photos" (first one is the cover).
   deal: "sale" or "rent". status: "available", "reserved", "sold" or "rented". price in euros (rent = per month).
   Optional: leave out price ("Price on request"), baths or size (hidden); "priceFrom": true shows "From", "priceAbout": true shows "About";
   "bedsTo": 3 shows a range such as 2-3 bedrooms.
   features: lift, heating, ac, furnished, metro, concierge, terrace, storage, pool, sea, parking, garden, gym. */
window.NX_HOMES = [
  {
    "id": "NX-106",
    "status": "available",
    "deal": "sale",
    "type": "apartment",
    "price": 439000,
    "priceFrom": true,
    "beds": 1,
    "bedsTo": 3,
    "city": "Madrid",
    "features": [
      "pool",
      "gym"
    ],
    "added": "2026-11-10",
    "title": {
      "fa": "پیش‌فروش آپارتمان‌های نوساز در چامارتین، مادرید",
      "en": "New-build flats off plan in Chamartín, Madrid",
      "es": "Pisos de obra nueva sobre plano en Chamartín, Madrid"
    },
    "text": {
      "fa": "ساختمان ۱۱ طبقه با ۶۸ واحد مسکونی در منطقه چامارتین. واحدهای یک، دو و سه‌خوابه. امکانات: استخر، باشگاه ورزشی، فضای Gourmet و Pet Spa.",
      "en": "An 11-storey building with 68 homes in Chamartín. One, two and three-bedroom flats. Pool, gym, a gourmet space and a pet spa.",
      "es": "Edificio de 11 plantas con 68 viviendas en Chamartín. Pisos de uno, dos y tres dormitorios. Piscina, gimnasio, espacio gourmet y pet spa."
    },
    "photos": [
      "chamartin-11",
      "chamartin-11-living"
    ]
  },
  {
    "id": "NX-105",
    "status": "available",
    "deal": "sale",
    "type": "apartment",
    "price": 461000,
    "priceAbout": true,
    "beds": 1,
    "bedsTo": 3,
    "city": "Madrid",
    "features": [
      "pool",
      "garden",
      "gym",
      "concierge"
    ],
    "added": "2026-11-10",
    "title": {
      "fa": "آپارتمان‌ها در برج‌های تتوان، مادرید",
      "en": "Flats in the Tetuán towers, Madrid",
      "es": "Pisos en las torres de Tetuán, Madrid"
    },
    "text": {
      "fa": "دو برج ۲۵ طبقه به ارتفاع حدود ۱۰۰ متر با بیش از ۶۰۰ واحد در منطقه تتوان. واحدهای یک، دو و سه‌خوابه. امکانات: استخر پانوراما در طبقه ۲۵، استخر در باغ، باشگاه ورزشی، سونا، فضای Coworking و نگهبانی ۲۴ ساعته. قیمت واحدهای موجود حدود ۴۶۱ هزار یورو.",
      "en": "Two 25-storey towers, about 100 metres tall, with more than 600 homes in Tetuán. One, two and three-bedroom flats. A panoramic pool on the 25th floor, a garden pool, gym, sauna, coworking space and 24-hour security. Available flats are priced at about €461,000.",
      "es": "Dos torres de 25 plantas y unos 100 metros de altura, con más de 600 viviendas en Tetuán. Pisos de uno, dos y tres dormitorios. Piscina panorámica en la planta 25, piscina en el jardín, gimnasio, sauna, coworking y seguridad 24 horas. Precio de los pisos disponibles: unos 461.000 €."
    },
    "photos": [
      "tetuan-towers",
      "tetuan-towers-living"
    ]
  },
  {
    "id": "NX-104",
    "status": "available",
    "deal": "sale",
    "type": "apartment",
    "beds": 1,
    "bedsTo": 4,
    "city": "Madrid",
    "features": [
      "pool",
      "gym",
      "garden",
      "parking",
      "storage"
    ],
    "added": "2026-11-10",
    "title": {
      "fa": "آپارتمان‌های نوساز در چامارتین، مادرید",
      "en": "New-build flats in Chamartín, Madrid",
      "es": "Pisos de obra nueva en Chamartín, Madrid"
    },
    "text": {
      "fa": "دو ساختمان در منطقه چامارتین: یک برج ۲۱ طبقه و یک ساختمان چهار طبقه به‌علاوه پنت‌هاوس، در مجموع ۱۷۶ واحد. واحدهای یک تا چهارخوابه. امکانات: استخر، باشگاه ورزشی، باغ، زمین ورزشی، پارکینگ و انباری.",
      "en": "Two buildings in Chamartín: a 21-storey tower and a four-storey building with penthouses, 176 homes in total. One to four-bedroom flats. Pool, gym, gardens, sports court, parking and storage rooms.",
      "es": "Dos edificios en Chamartín: una torre de 21 plantas y un edificio de cuatro plantas más áticos, 176 viviendas en total. Pisos de uno a cuatro dormitorios. Piscina, gimnasio, jardines, pista deportiva, garaje y trasteros."
    },
    "photos": [
      "chamartin-gardens",
      "chamartin-gardens-living"
    ]
  },
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
