export interface BlogPost {
  slug: string;
  title: string;
  titleEs: string;
  excerpt: string;
  excerptEs: string;
  content: string;
  contentEs: string;
  coverImage: string;
  date: string;
  readTime: number;
  category: string;
  categoryEs: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "best-places-to-visit-cozumel-by-buggy",
    title: "The 7 Best Places to Visit in Cozumel by Buggy",
    titleEs: "Los 7 Mejores Lugares para Visitar en Cozumel en Buggy",
    excerpt: "Explore Cozumel's hidden gems, stunning beaches, and colorful streets in the most fun way possible — behind the wheel of an open-air buggy.",
    excerptEs: "Explora las joyas escondidas de Cozumel, sus impresionantes playas y sus coloridas calles de la forma más divertida posible — al volante de un buggy descapotable.",
    coverImage: "/images/buggy2.jpg",
    date: "2024-03-15",
    readTime: 6,
    category: "Travel Guide",
    categoryEs: "Guía de Viaje",
    content: `
## Why a Buggy is the Best Way to See Cozumel

Cozumel is a small island — just 48 km long and 16 km wide — which makes it perfect for exploring by buggy. You can feel the ocean breeze, stop anywhere you want, and reach spots that big tour buses simply can't access. Before you go, check out our [Driving in Cozumel 101 guide](/en/driving-guide) — it covers the road rules, speed bumps, and gas station tips you'll actually need.

Here are our 7 favorite stops:

---

## 1. Playa Palancar

One of the most beautiful beaches on the island, Palancar sits on the southwestern tip of Cozumel. The water is crystal clear turquoise, and the beach is calm and quiet. Grab a coconut, put your feet in the sand, and enjoy paradise.

**Tip:** Go early in the morning before the cruise ship crowds arrive.

---

## 2. Punta Sur Eco Beach Park

The southernmost point of Cozumel is a stunning nature reserve with a lighthouse, crocodile lagoon, and some of the most dramatic ocean views on the island. The road to get there is perfect buggy territory.

**Tip:** Bring sunscreen — there's not much shade here.

---

## 3. El Cedral Village

This tiny village is home to Cozumel's oldest Maya ruins and a colorful local church. It's completely off the typical tourist trail. The drive through the jungle to get here is half the fun.

---

## 4. Mezcalitos Beach Bar

Halfway down the windward coast, this legendary beach bar has been serving ice-cold drinks since 1969. Park your buggy, order a Michelada, and watch the waves crash on the rocky shore.

---

## 5. Playa Bonita

True to its name ("Beautiful Beach"), this spot on the eastern coast is wild, windy, and spectacular. The waves are too rough for swimming, but the scenery is unbeatable. Perfect for photos.

---

## 6. San Gervasio Ruins

The main Maya archaeological site on the island, San Gervasio was a pilgrimage center dedicated to Ixchel, the goddess of fertility and medicine. Walking through ancient ruins surrounded by jungle is unforgettable.

---

## 7. Cozumel Town (San Miguel)

Don't miss the main town! Park your buggy on the malecon (boardwalk) and explore the colorful streets, local markets, fresh seafood restaurants, and the beautiful central plaza.

---

## Ready to Explore?

Book your buggy with us and we'll make sure you start your adventure from the best spot on the island. We're located at Km 4.3 on the Costera Sur highway — just minutes from the cruise ports. [Check our pricing](/en/pricing) — at $75/day split between up to 5 people, it's the best deal on the island.

If you're coming off a cruise ship, also read [The Ultimate Cozumel Cruise Day Guide](/en/blog/cozumel-cruise-day-guide) for a perfect hour-by-hour itinerary.
    `,
    contentEs: `
## Por Qué un Buggy es la Mejor Forma de Ver Cozumel

Cozumel es una isla pequeña — solo 48 km de largo y 16 km de ancho — lo que la hace perfecta para explorar en buggy. Sientes la brisa del mar, puedes parar donde quieras, y llegas a lugares que los autobuses turísticos simplemente no pueden acceder. Antes de salir, revisa nuestra [guía de manejo en Cozumel](/es/driving-guide) — tiene todo sobre las reglas viales, topes y gasolineras.

Aquí están nuestros 7 paradas favoritas:

---

## 1. Playa Palancar

Una de las playas más hermosas de la isla, Palancar se encuentra en el extremo suroeste de Cozumel. El agua es de un turquesa cristalino, y la playa es tranquila y serena. Toma un coco, pon los pies en la arena y disfruta del paraíso.

**Consejo:** Ve temprano en la mañana antes de que lleguen las multitudes de los cruceros.

---

## 2. Punta Sur Eco Beach Park

El punto más al sur de Cozumel es una impresionante reserva natural con un faro, laguna de cocodrilos, y algunas de las vistas más dramáticas del océano en la isla. El camino para llegar es perfecto para un buggy.

**Consejo:** Lleva bloqueador solar — aquí hay poca sombra.

---

## 3. Pueblo El Cedral

Este pequeño pueblo alberga las ruinas mayas más antiguas de Cozumel y una colorida iglesia local. Está completamente fuera de la ruta turística típica. El camino a través de la selva para llegar aquí es la mitad de la diversión.

---

## 4. Bar de Playa Mezcalitos

A mitad de la costa de barlovento, este legendario bar de playa ha servido bebidas bien frías desde 1969. Estaciona tu buggy, pide una Michelada y observa las olas romperse en la costa rocosa.

---

## 5. Playa Bonita

Fiel a su nombre, este lugar en la costa oriental es salvaje, ventoso y espectacular. Las olas son demasiado fuertes para nadar, pero el paisaje es incomparable. Perfecto para fotos.

---

## 6. Ruinas de San Gervasio

El principal sitio arqueológico maya de la isla, San Gervasio fue un centro de peregrinación dedicado a Ixchel, la diosa de la fertilidad y la medicina. Caminar por ruinas antiguas rodeadas de selva es inolvidable.

---

## 7. El Centro (San Miguel)

¡No te pierdas el pueblo principal! Estaciona tu buggy en el malecón y explora las coloridas calles, mercados locales, restaurantes de mariscos frescos y la hermosa plaza central.

---

## ¿Listo para Explorar?

Reserva tu buggy con nosotros y nos aseguraremos de que empieces tu aventura desde el mejor lugar de la isla. Estamos ubicados en el Km 4.3 de la Costera Sur — a minutos de los puertos de cruceros. [Ver precios](/es/pricing) — $75/día entre hasta 5 personas es la mejor tarifa de la isla.

Si llegas en crucero, lee también [La Guía Definitiva para el Día de Crucero en Cozumel](/es/blog/cozumel-cruise-day-guide) para un itinerario perfecto hora por hora.
    `,
  },
  {
    slug: "cozumel-cruise-day-guide",
    title: "The Ultimate Cozumel Cruise Day Guide: Make the Most of Your Port Stop",
    titleEs: "La Guía Definitiva para el Día de Crucero en Cozumel: Aprovecha al Máximo tu Escala",
    excerpt: "Got one day in Cozumel from your cruise? Here's exactly how to spend it — including why a buggy rental is the smartest decision you'll make.",
    excerptEs: "¿Tienes un día en Cozumel desde tu crucero? Aquí te decimos exactamente cómo aprovecharlo — incluyendo por qué rentar un buggy es la decisión más inteligente que tomarás.",
    coverImage: "/images/buggy3.jpg",
    date: "2024-04-02",
    readTime: 7,
    category: "Cruise Tips",
    categoryEs: "Tips para Cruceristas",
    content: `
## You Have One Day. Make It Count.

Most cruise ships dock in Cozumel for 6–10 hours. That's enough time to have an incredible day — if you plan it right. Here's a timeline that works perfectly.

---

## 8:00 AM — Pick Up Your Buggy

As soon as you get off the ship, head straight to us at Km 4.3 on the Costera Sur (just a short taxi ride from the port). We open at 8 AM and your buggy will be ready and waiting. [Book your spot in advance](/en/book) — cruise days fill up fast.

**Why not a tour bus?** Because with a buggy, YOU decide where to go and how long to stay. No waiting for 40 other people, no rushed schedules.

---

## 8:30 AM — Head South on the Costera Sur

The Costera Sur highway runs down the western coast of the island and is completely breathtaking. Ocean on your left, jungle on your right. Roll down the (non-existent) windows of your buggy and enjoy.

---

## 9:00 AM — Stop at Playa Palancar

Spend an hour at this gorgeous beach. Swim, snorkel, or just sit and stare at the most beautiful water you've ever seen. Palancar Beach Club has lounge chairs and food if you want to stay longer.

---

## 11:00 AM — Cross to the East Coast

Drive across the island through the jungle. The eastern (windward) coast is completely different — wild, dramatic, and almost empty. Stop at Playa Bonita for photos and Mezcalitos for a drink.

---

## 1:00 PM — Lunch in Town

Head back to San Miguel for fresh seafood. La Choza is a local favorite. Fish tacos, ceviche, and cold beer — the perfect combination.

---

## 2:30 PM — Explore the Town

Walk the malecón, browse the markets, maybe grab some vanilla or locally made jewelry. The town center is beautiful and walkable.

---

## 4:00 PM — Return Your Buggy

Return your buggy to us and make your way back to the ship. We're conveniently close to the port, so you'll never be rushed.

---

## Important Tips for Cruise Passengers

- **Tell us your all-aboard time** when you book — we'll make sure you're never late
- **Book in advance** — buggy spots fill up fast on cruise days
- **Bring cash for tips** at beach clubs and restaurants
- **Download an offline map** of Cozumel before leaving the ship

Before you hit the road, read our [Driving in Cozumel 101 guide](/en/driving-guide) — it takes 5 minutes and could save you a ticket (and your rear license plate 😅).

---

[Book your buggy now](/en/book) and start planning your perfect Cozumel day! For more inspiration on where to go, check out [The 7 Best Places to Visit in Cozumel by Buggy](/en/blog/best-places-to-visit-cozumel-by-buggy).
    `,
    contentEs: `
## Tienes un Día. Aprovéchalo al Máximo.

La mayoría de los cruceros atracan en Cozumel durante 6 a 10 horas. Eso es suficiente para tener un día increíble — si lo planeas bien. Aquí tienes un itinerario que funciona perfectamente.

---

## 8:00 AM — Recoge tu Buggy

En cuanto bajes del barco, dirígete directamente a nosotros en el Km 4.3 de la Costera Sur (a solo un corto trayecto en taxi desde el puerto). Abrimos a las 8 AM y tu buggy estará listo y esperándote. [Reserva con anticipación](/es/book) — los días de crucero se llenan rápido.

**¿Por qué no un autobús turístico?** Porque con un buggy, TÚ decides adónde ir y cuánto tiempo quedarte. Sin esperar a 40 personas más, sin horarios apresurados.

---

## 8:30 AM — Dirígete al Sur por la Costera Sur

La carretera Costera Sur recorre la costa occidental de la isla y es absolutamente impresionante. El océano a tu izquierda, la selva a tu derecha. Disfruta del viaje en tu buggy.

---

## 9:00 AM — Para en Playa Palancar

Pasa una hora en esta hermosa playa. Nada, bucea o simplemente siéntate y contempla el agua más bella que hayas visto. El Beach Club de Palancar tiene camastros y comida si quieres quedarte más tiempo.

---

## 11:00 AM — Cruza a la Costa Este

Conduce a través de la isla por la selva. La costa oriental es completamente diferente — salvaje, dramática y casi vacía. Para en Playa Bonita para fotos y en Mezcalitos para tomar algo.

---

## 1:00 PM — Almuerzo en el Centro

Regresa a San Miguel para comer mariscos frescos. La Choza es un favorito local. Tacos de pescado, ceviche y cerveza fría — la combinación perfecta.

---

## 2:30 PM — Explora el Centro

Camina por el malecón, recorre los mercados, quizás compra algo de vainilla o joyería artesanal. El centro del pueblo es hermoso y perfecto para caminar.

---

## 4:00 PM — Devuelve tu Buggy

Devuelve tu buggy y regresa al barco. Estamos convenientemente cerca del puerto, así que nunca estarás con prisa.

---

## Consejos Importantes para Cruceristas

- **Dinos tu hora de embarque** al reservar — nos aseguraremos de que nunca llegues tarde
- **Reserva con anticipación** — los buggies se llenan rápido en días de crucero
- **Trae efectivo para propinas** en beach clubs y restaurantes
- **Descarga un mapa sin conexión** de Cozumel antes de dejar el barco

Antes de salir, lee nuestra [guía de manejo en Cozumel](/es/driving-guide) — te explicamos los topes escondidos, las gasolineras y las reglas de tránsito en 5 minutos.

---

[Reserva tu buggy ahora](/es/book) y comienza a planear tu día perfecto en Cozumel. Para más ideas de destinos, consulta [Los 7 Mejores Lugares para Visitar en Cozumel en Buggy](/es/blog/best-places-to-visit-cozumel-by-buggy).
    `,
  },
  {
    slug: "cozumel-with-kids-family-guide",
    title: "Cozumel with Kids: A Family-Friendly Guide to the Island",
    titleEs: "Cozumel con Niños: Una Guía Familiar de la Isla",
    excerpt: "Traveling to Cozumel with your family? Discover the best kid-friendly activities, beaches, and tips to make your trip unforgettable for everyone.",
    excerptEs: "¿Viajando a Cozumel con tu familia? Descubre las mejores actividades, playas y consejos para hacer tu viaje inolvidable para todos.",
    coverImage: "/images/buggy5.jpg",
    date: "2024-04-20",
    readTime: 5,
    category: "Family Travel",
    categoryEs: "Viaje en Familia",
    content: `
## Cozumel is Perfect for Families

Cozumel checks all the boxes for a family vacation: calm beaches, clear water, fun activities, great food, and friendly locals. And yes — kids absolutely love riding in an open-air buggy!

---

## Is a Buggy Safe for Kids?

Yes! Our buggies are street-legal vehicles with proper seatbelts. Kids love the open-air experience, and driving on Cozumel's roads is relaxed and easy. Just make sure your little ones are buckled up.

**Each buggy fits up to 5 people**, so one buggy is perfect for a family of 4.

---

## Best Kid-Friendly Spots

### Playa Palancar
The calm, clear water is perfect for kids. Shallow areas near the shore are safe for swimming, and the snorkeling is incredible even for beginners.

### Cozumel Aquarium (Discover Mexico Park)
Right in town, this park has a turtle sanctuary, an aquarium, and a mini replica of famous Mexican monuments. Kids love it.

### Mr. Sancho's Beach Club
One of the most family-friendly beach clubs on the island, with a pool, water slides, and a playground. Great for a full day out.

### El Cedral Ruins
Even young kids find ancient Maya ruins fascinating. The site is small and easy to walk, and there's often local wildlife (iguanas!) to spot.

---

## Family Travel Tips for Cozumel

- **Book morning activities** — afternoons get hot, and kids (and parents) need nap time
- **Pack reef-safe sunscreen** — required at many beaches and good for the coral
- **Bring snacks and water** in the buggy — you'll thank yourself later
- **The buggy is a hit** — kids absolutely love it. It's like a permanent adventure mode

New to driving in Cozumel? Our [Driving in Cozumel 101 guide](/en/driving-guide) covers everything from road rules to hidden speed bumps — a must-read before you set off with the family.

---

Ready to show your kids the most beautiful island in Mexico? [Book your family buggy today](/en/book) — up to 5 people, one flat price of $75/day. Also check out [our cruise day guide](/en/blog/cozumel-cruise-day-guide) if you're visiting from a ship.
    `,
    contentEs: `
## Cozumel es Perfecta para Familias

Cozumel cumple todos los requisitos para unas vacaciones familiares: playas tranquilas, agua cristalina, actividades divertidas, buena comida y lugareños amables. ¡Y sí — a los niños les encanta andar en buggy descapotable!

---

## ¿Es Seguro un Buggy para los Niños?

¡Sí! Nuestros buggies son vehículos legales con cinturones de seguridad adecuados. A los niños les encanta la experiencia al aire libre, y conducir por las carreteras de Cozumel es relajado y fácil. Solo asegúrate de que los pequeños estén abrochados.

**Cada buggy tiene capacidad para hasta 5 personas**, así que un buggy es perfecto para una familia de 4.

---

## Los Mejores Lugares para Niños

### Playa Palancar
El agua tranquila y cristalina es perfecta para los niños. Las zonas poco profundas cerca de la orilla son seguras para nadar, y el buceo es increíble incluso para principiantes.

### Acuario de Cozumel (Discover Mexico Park)
Justo en el centro, este parque tiene un santuario de tortugas, un acuario y una mini réplica de monumentos mexicanos famosos. A los niños les encanta.

### Beach Club Mr. Sancho's
Uno de los beach clubs más familiares de la isla, con piscina, toboganes acuáticos y área de juegos. Ideal para pasar el día completo.

### Ruinas El Cedral
Incluso los niños pequeños encuentran las ruinas mayas fascinantes. El sitio es pequeño y fácil de recorrer, y a menudo hay vida silvestre local (¡iguanas!) para observar.

---

## Consejos para Viajar en Familia a Cozumel

- **Planea actividades por la mañana** — las tardes son calurosas, y los niños (y papás) necesitan descanso
- **Trae protector solar arrecife-seguro** — requerido en muchas playas y bueno para el coral
- **Lleva snacks y agua** en el buggy — te lo agradecerás después
- **El buggy es un éxito** — a los niños les encanta absolutamente. Es como el modo aventura permanente

---

¿Listo para mostrarle a tus hijos la isla más hermosa de México? ¡Reserva tu buggy familiar hoy!
    `,
  },
  {
    slug: "buggy-rental-cozumel-complete-guide",
    title: "Buggy Rental in Cozumel: The Complete Guide (2025)",
    titleEs: "Renta de Buggy en Cozumel: La Guía Completa (2025)",
    excerpt: "Everything you need to know about renting a buggy in Cozumel — prices, what's included, where to pick up, and how to make the most of your day on the island.",
    excerptEs: "Todo lo que necesitas saber para rentar un buggy en Cozumel — precios, qué incluye, dónde recogerlo y cómo aprovechar al máximo tu día en la isla.",
    coverImage: "/images/buggy1.jpg",
    date: "2025-01-10",
    readTime: 7,
    category: "Travel Guide",
    categoryEs: "Guía de Viaje",
    content: `## Why Rent a Buggy in Cozumel?\n\nCozumel is one of the most beautiful islands in the Caribbean, and the best way to see it is in an open-air buggy. No fixed schedule, no crowded groups — total freedom.\n\n## How Much Does a Buggy Rental Cost?\n\nAt Buggy Rentals with Dani: $75 USD for a full day, per buggy. Up to 4 passengers — less than $20 per person. Includes liability insurance, full tank, and WhatsApp support.\n\n## Where to Pick Up\n\nCarr. Costera Sur Km 4.3, directly across from Puerta Maya and SSA Internacional cruise terminals. Open every day 8 AM – 5 PM.\n\n## Do I Need a Driver's License?\n\nYes. Any valid driver's license from the US, Canada, or any country is accepted. Must be 18+.\n\n## What Can I Do?\n\nThe island is 48km long — perfect for a full day. Top stops: Playa Palancar, Punta Sur Eco Park, El Cedral village, Mezcalitos beach bar, Playa Bonita, San Gervasio ruins, and San Miguel town.\n\n## Tips\n\n1. Book in advance — cruise days fill up fast\n2. Start at 8 AM to beat crowds\n3. Bring reef-safe sunscreen\n4. Tell us your all-aboard time\n\n[Book your buggy now](/en/book)`,
    contentEs: `## ¿Por Qué Rentar un Buggy en Cozumel?\n\nCozumel es una de las islas más hermosas del Caribe. Con un buggy tienes total libertad: paras donde quieras, te quedas el tiempo que desees.\n\n## ¿Cuánto Cuesta?\n\nEn Buggy Rentals with Dani: $75 USD por día completo, por buggy. Hasta 4 pasajeros — menos de $20 por persona. Incluye seguro, tanque lleno y soporte por WhatsApp.\n\n## ¿Dónde Recogerlo?\n\nCarr. Costera Sur Km 4.3, directamente frente a los terminales Puerta Maya y SSA Internacional. Abrimos todos los días de 8 AM a 5 PM.\n\n## ¿Necesito Licencia?\n\nSí. Se acepta cualquier licencia válida de EE.UU., Canadá o cualquier país. Mínimo 18 años.\n\n## ¿Qué Puedo Hacer?\n\nLa isla mide 48km — perfecta para un día completo. Mejores destinos: Playa Palancar, Punta Sur, El Cedral, Mezcalitos, Playa Bonita, Ruinas San Gervasio y el centro de San Miguel.\n\n[Reserva tu buggy ahora](/es/book)`,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
