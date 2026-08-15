import arithmetic from "../assets/books/Arithmetic.jpeg";
import mentalAbility from "../assets/books/mental-ability.jpeg";
import passage from "../assets/books/passage.jpeg";

const books = [
  {
    id: "arithmetic",
    title: "Arithmetic",
    image: arithmetic,
    description:
      "Arithmetic preparation book for Jawahar Navodaya Vidyalaya entrance examination.",

    originalPrice: 200,
    discount: 15,

    language: "KANNADA & ENGLISH",

    mediums: [
      "Kannada",
      "English",
      "Hindi",
      "Marathi",
    ],
  },

  {
    id: "mental-ability",
    title: "Mental Ability",
    image: mentalAbility,
    description:
      "Mental Ability preparation book with concept-based practice questions.",

    originalPrice: 200,
    discount: 10,

    language: "KANNADA & ENGLISH",

    mediums: [
      "Kannada",
      "English",
      "Hindi",
      "Marathi",
    ],
  },

  {
    id: "passage",
    title: "Passage",
    image: passage,
    description:
      "Passage preparation book for improving comprehension and examination skills.",

    originalPrice: 200,
    discount: 20,

    language: "KANNADA & ENGLISH",

    mediums: [
      "Kannada",
      "English",
      "Hindi",
      "Marathi",
    ],
  },
];

export default books;