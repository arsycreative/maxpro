// components/PromoCards.js
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

export default function PromoCards() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const promoData = [
    {
      id: 1,
      title: "Sewa TV LED mulai dari 350k",
      subtitle: "Free Standing Bracket",
      originalPrice: "550k",
      discountPrice: "350k",
      unit: "/unit",
      badge: "Diskon Mantap",
      features: [
        "Top brand Samsung / LG",
        "Free Standing Bracket",
        "Ada Port USB flashdisk",
        "Free Kabel HDMI",
      ],
      suitable: "Cocok untuk pameran / meeting",
      image:
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      gradient: "from-blue-500/20 to-purple-600/20",
    },
    {
      id: 2,
      title: "Sewa Proyektor Berkualitas",
      subtitle: "Berbagai Lumens Tersedia",
      originalPrice: "400k",
      discountPrice: "300k",
      unit: "/unit",
      badge: "Best Seller",
      features: [
        "2700-5000 Lumens",
        "Free Kabel VGA & HDMI",
        "Cocok ruangan besar",
        "Kualitas gambar jernih",
      ],
      suitable: "Cocok untuk seminar / presentasi",
      image:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      gradient: "from-green-500/20 to-teal-600/20",
    },
    {
      id: 3,
      title: "Sewa Speaker Portable",
      subtitle: "Free 2 Mic Wireless",
      originalPrice: "450k",
      discountPrice: "350k",
      unit: "/unit",
      badge: "Promo Spesial",
      features: [
        "Speaker 12 inch",
        "Free Mic Wireless 2 pcs",
        "Battery rechargeable",
        "Indoor & Outdoor",
      ],
      suitable: "Cocok untuk gathering / outdoor",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      gradient: "from-orange-500/20 to-red-600/20",
    },
    {
      id: 4,
      title: "Paket Lengkap Seminar",
      subtitle: "Proyektor + Screen + Sound",
      originalPrice: "800k",
      discountPrice: "650k",
      unit: "/paket",
      badge: "Hemat 150k",
      features: [
        "Proyektor 3200 Lumens",
        "Screen 2x2m",
        "Speaker + 2 Mic",
        "Free setup & operator",
      ],
      suitable: "Cocok untuk seminar besar",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      gradient: "from-purple-500/20 to-pink-600/20",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promoData.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promoData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promoData.length) % promoData.length);
  };

  return (
    <div className="relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h3 className="text-2xl font-bold text-white mb-2">Promo Special</h3>
        <p className="text-gray-400">Penawaran terbaik untuk event Anda</p>
      </motion.div>

      {/* Slider Container */}
      <div className="relative h-[600px] lg:h-[650px] overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div
              className={`card-glass h-full rounded-2xl overflow-hidden bg-gradient-to-br ${promoData[currentSlide].gradient} border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 opacity-10">
                <img
                  src={promoData[currentSlide].image}
                  alt={promoData[currentSlide].title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center justify-center w-fit bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4"
                >
                  {promoData[currentSlide].badge}
                </motion.div>

                {/* Title */}
                <motion.h4
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl lg:text-2xl font-bold text-white mb-2 leading-tight"
                >
                  {promoData[currentSlide].title}
                </motion.h4>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300 mb-4"
                >
                  {promoData[currentSlide].subtitle}
                </motion.p>

                {/* Pricing */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-gray-400 text-lg line-through">
                      {promoData[currentSlide].originalPrice}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      DISKON
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-sm text-gray-400">Mulai</span>
                    <span className="text-3xl lg:text-4xl font-bold text-gradient">
                      {promoData[currentSlide].discountPrice}
                    </span>
                    <span className="text-gray-400">
                      {promoData[currentSlide].unit}
                    </span>
                  </div>
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex-grow mb-6"
                >
                  <h5 className="text-white font-semibold mb-3">Features:</h5>
                  <ul className="space-y-2">
                    {promoData[currentSlide].features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center space-x-2 text-gray-300"
                      >
                        <CheckIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Suitable For */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-6"
                >
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-blue-300 text-sm font-medium">
                      {promoData[currentSlide].suitable}
                    </p>
                  </div>
                </motion.div>

                {/* WhatsApp Button */}
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://wa.me/6285712165658"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center space-x-2 shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  <span>WhatsApp Sekarang</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {promoData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-red-500 w-8"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
