/* components/PromoCards.js */
"use client";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";

const promos = [
  {
    title: "Sewa TV LED Mulai dari 350k",
    subtitle: "Free Standing Bracket",
    oldPrice: 550,
    price: 350,
    features: [
      "Top Brand Samsung / LG",
      "Free Standing Bracket",
      "Port USB Flashdisk",
      "Kabel HDMI Gratis",
    ],
    cta: "Chat WhatsApp",
    link: "https://wa.me/6285712165658",
  },
  {
    title: "Sewa Proyektor 4K Mulai dari 500k",
    subtitle: "Resolusi Ultra HD",
    oldPrice: 750,
    price: 500,
    features: [
      "Lampu 3000 Lumen",
      "Speaker Built-in",
      "Kabel HDMI & VGA",
      "Mounting Flexible",
    ],
    cta: "Chat WhatsApp",
    link: "https://wa.me/6285712165658",
  },
  // Tambah promo lain sesuai kebutuhan
];

export default function PromoCarousel() {
  const [current, setCurrent] = useState(0);
  const length = promos.length;
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1)),
      6000
    );
    return () => clearTimeout(timeoutRef.current);
  }, [current, length]);

  const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);
  const nextSlide = () => setCurrent(current === length - 1 ? 0 : current + 1);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="overflow-hidden rounded-3xl shadow-2xl bg-white/80 backdrop-blur-md">
        <motion.div
          animate={{ x: `-${current * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="flex w-full"
        >
          {promos.map((promo, i) => (
            <div key={i} className="min-w-full p-6">
              <h3 className="text-2xl font-extrabold text-gray-800 mb-2">
                {promo.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{promo.subtitle}</p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-gray-400 line-through">
                  Rp{promo.oldPrice}.000
                </span>
                <span className="text-3xl font-bold text-red-600">
                  Rp{promo.price}.000
                </span>
              </div>
              <ul className="list-inside list-disc space-y-1 text-gray-700 mb-6">
                {promo.features.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
              <a
                href={promo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 font-semibold rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg hover:opacity-90 transition"
              >
                {promo.cta}
              </a>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:scale-105 transition"
      >
        <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:scale-105 transition"
      >
        <ChevronRightIcon className="w-6 h-6 text-gray-600" />
      </button>

      {/* Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {promos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === current ? "bg-red-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
