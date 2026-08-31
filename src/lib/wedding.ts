// Central wedding details — single source of truth.
export const WEDDING = {
  bride: "Rushali",
  groom: "Somya",
  // The card art reads "Somya & Rushali"
  coupleDisplay: ["Somya", "Rushali"] as const,
  monogram: "S & R",
  dateDisplay: "30 / 11 / 2026",
  dateShort: "30.11.2026",
  // Target date for countdown (local). Month is 0-indexed in JS Date.
  targetDate: new Date(2026, 10, 30, 18, 0, 0),
  hashtag: "#SomyaWedsRushali",
  venue: "Orica Resort",
  city: "Bhilwara, Rajasthan",
  address:
    "200 Feet Ring Road, near Hanuman Circle, Eras, Bhilwara, Rajasthan 311001",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "Orica Resort, 200 Feet Ring Road, near Hanuman Circle, Eras, Bhilwara, Rajasthan 311001"
    ),
};

export const EVENTS = [
  {
    time: "28 Nov · 7:00 PM",
    title: "Neon Night",
    desc: "Step into a world of vibrant colors and electrifying energy at our Neon Night!",
    icon: "leaf",
  },
  {
    time: "29 Nov · 09:00 AM",
    title: "Kalash",
    desc: "A sacred morning puja inviting blessings and prosperity as the celebrations begin.",
    icon: "sun",
  },
  {
    time: "29 Nov · 11:30 AM",
    title: "Grah Shanti/Myra",
    desc: "A sacred celebration of blessings, family traditions and joyful moments with loved ones.",
    icon: "sun",
  },
  {
    time: "29 Nov · 03:00 PM",
    title: "Carnival",
    desc: "An afternoon of flow, dance and celebration for family and friends.",
    icon: "sun",
  },
  {
    time: "29 Nov · 07:30 PM",
    title: "Sangeet",
    desc: "A night of dance, song and celebration under the stars.",
    icon: "music",
  },

  {
    time: "30 Nov · 12:15 PM",
    title: "Wedding",
    desc: "Two souls, one vow — by the pool.",
    icon: "rings",
  },
  {
    time: "30 Nov · 07:30 PM",
    title: "Reception",
    desc: "An evening of celebration, music, delicious food and cherished moments with loved ones.",
    icon: "glass",
  },
];
