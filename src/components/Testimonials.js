"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Budi Santoso",
      role: "Event Organizer",
      company: "PT. Kreatif Indonesia",
      rating: 5,
      text: "MAXPRO sangat profesional dalam pelayanan. Proyektor yang disewa kualitasnya bagus, pengantaran tepat waktu, dan tim teknisinya sangat membantu setup acara seminar kami. Highly recommended!",
      event: "Seminar Bisnis 2024",
    },
    {
      id: 2,
      name: "Sari Dewi",
      role: "Wedding Organizer",
      company: "Elegant Wedding",
      rating: 5,
      text: "Pelayanan MAXPRO luar biasa! TV LED yang disewa untuk acara pernikahan klien kami berkualitas premium. Setup cepat, operator profesional, dan harga sangat terjangkau. Pasti akan sewa lagi!",
      event: "Wedding Reception",
    },
    {
      id: 3,
      name: "Ahmad Rizki",
      role: "Koordinator Acara",
      company: "Universitas Gadjah Mada",
      rating: 5,
      text: "Sudah beberapa kali sewa sound system dan proyektor di MAXPRO untuk acara kampus. Alat selalu dalam kondisi prima, teknisi berpengalaman, dan response admin sangat cepat. Top service!",
      event: "Conference Akademik",
    },
    {
      id: 4,
      name: "Linda Puspita",
      role: "Marketing Manager",
      company: "CV. Maju Bersama",
      rating: 5,
      text: "Pengalaman sewa di MAXPRO sangat memuaskan. Untuk launching produk kami, mereka menyediakan setup multimedia lengkap dengan kualitas HD. Tim support juga standby selama acara berlangsung.",
      event: "Product Launch",
    },
    {
      id: 5,
      name: "Doni Prasetyo",
      role: "HRD Manager",
      company: "Bank Mandiri Cabang Yogya",
      rating: 5,
      text: "MAXPRO solusi terbaik untuk kebutuhan multimedia corporate. Peralatan modern, instalasi profesional, dan after-service yang memuaskan. Sudah menjadi partner tetap untuk event kantor kami.",
      event: "Corporate Training",
    },
    {
      id: 6,
      name: "Maya Sari",
      role: "Event Coordinator",
      company: "Pemda DIY",
      rating: 5,
      text: "Pelayanan MAXPRO sangat membantu acara pemerintahan kami. Sound system outdoor berkualitas tinggi, megaphone jernih, dan tim teknisi yang dapat diandalkan. Terima kasih MAXPRO!",
      event: "Acara Pemerintahan",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Apa Kata{" "}
            <span className="bg-gradient-to-r from-red-600 via-red-400 to-red-600 bg-clip-text text-transparent">
              Mereka?
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Testimonial dari ribuan client yang telah mempercayakan kebutuhan
            multimedia mereka kepada{" "}
            <span className="text-red-500 font-semibold">MAXPRO</span>
          </p>
          <div className="flex items-center justify-center mt-8 space-x-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-red-400"></div>
            <div className="flex items-center space-x-1">{renderStars(5)}</div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-red-400"></div>
          </div>
        </motion.div>

        {/* Testimonial Slider Container with Navigation Buttons */}
        <div className="max-w-6xl mx-auto relative px-16">
          {/* Navigation Buttons - Positioned outside the card */}
          <motion.button
            onClick={prevTestimonial}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/20 transition-all duration-300 z-10 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={nextTestimonial}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/20 transition-all duration-300 z-10 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Testimonial Card */}
          <div className="relative overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12"
              >
                {/* Quote Icon */}
                <div className="absolute top-8 right-8 opacity-20">
                  <Quote className="w-16 h-16 text-red-400" />
                </div>

                <div className="text-center">
                  {/* Testimonial Text */}
                  <motion.blockquote
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg lg:text-2xl text-gray-200 leading-relaxed italic mb-8 max-w-4xl mx-auto"
                  >
                    {`"${testimonials[currentIndex].text}"`}
                  </motion.blockquote>

                  {/* User Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="space-y-3"
                  >
                    <div className="flex justify-center space-x-1 mb-4">
                      {renderStars(testimonials[currentIndex].rating)}
                    </div>

                    <h3 className="text-xl lg:text-2xl font-bold text-white">
                      {testimonials[currentIndex].name}
                    </h3>

                    <p className="text-red-400 font-medium">
                      {testimonials[currentIndex].role}
                    </p>

                    {/* <p className="text-gray-400">
                      {testimonials[currentIndex].company}
                    </p> */}

                    <div className="inline-block bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mt-4">
                      {testimonials[currentIndex].event}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-3 mt-12">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-red-400 scale-125"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
