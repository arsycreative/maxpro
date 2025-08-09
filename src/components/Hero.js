"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ChevronDown,
  Play,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  MessageCircle,
} from "lucide-react";
import { redirectToWhatsApp } from "@/app/utils/whatsapp";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const slideInFromRight = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// PromoCards Component with Framer Motion
const PromoCards = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const promoData = [
    {
      id: 1,
      title: "Sewa TV LED Premium",
      subtitle: "Free Standing Bracket + Setup",
      originalPrice: "550k",
      discountPrice: "350k",
      unit: "/unit",
      badge: "Diskon 36%",
      badgeColor: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      features: [
        "Top brand Samsung / LG",
        "Free Standing Bracket",
        "Port USB & HDMI lengkap",
        "Setup & maintenance included",
      ],
      suitable: "Perfect untuk pameran & meeting room",
      gradient: "from-blue-500/10 via-indigo-500/10 to-purple-500/10",
      accentColor: "border-blue-500/30",
    },
    {
      id: 2,
      title: "Proyektor Professional",
      subtitle: "High Lumens & Crystal Clear",
      originalPrice: "400k",
      discountPrice: "300k",
      unit: "/unit",
      badge: "Best Seller",
      badgeColor: "bg-gradient-to-r from-orange-500 to-red-500",
      features: [
        "2700-5000 Lumens range",
        "Free kabel VGA & HDMI",
        "Optimal untuk ruang besar",
        "Teknologi DLP terbaru",
      ],
      suitable: "Ideal untuk seminar & presentasi",
      gradient: "from-emerald-500/10 via-teal-500/10 to-cyan-500/10",
      accentColor: "border-emerald-500/30",
    },
    {
      id: 3,
      title: "Speaker System Pro",
      subtitle: "Wireless Mics Included",
      originalPrice: "450k",
      discountPrice: "350k",
      unit: "/unit",
      badge: "Promo Terbatas",
      badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
      features: [
        "Speaker aktif 12 inch",
        "2x Mic wireless premium",
        "Battery tahan 8+ jam",
        "Indoor & outdoor ready",
      ],
      suitable: "Cocok untuk event outdoor & gathering",
      gradient: "from-orange-500/10 via-red-500/10 to-pink-500/10",
      accentColor: "border-orange-500/30",
    },
    {
      id: 4,
      title: "Paket Seminar Complete",
      subtitle: "All-in-One Solution",
      originalPrice: "800k",
      discountPrice: "650k",
      unit: "/paket",
      badge: "Hemat 19%",
      badgeColor: "bg-gradient-to-r from-indigo-500 to-blue-500",
      features: [
        "Proyektor 3200 Lumens",
        "Screen premium 2x2m",
        "Sound system + 2 mic",
        "Teknisi & operator included",
      ],
      suitable: "Solution terbaik untuk seminar besar",
      gradient: "from-violet-500/10 via-purple-500/10 to-fuchsia-500/10",
      accentColor: "border-violet-500/30",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % promoData.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + promoData.length) % promoData.length);

  const currentPromo = promoData[currentSlide];

  return (
    <motion.div
      className="relative w-full max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      initial="hidden"
      animate="visible"
      variants={slideInFromRight}
    >
      {/* Enhanced Ribbon "Promo Eksklusif" */}
      <div className="absolute top-1 right-2 transform translate-x-1/5 -translate-y-1/2 rotate-15 bg-red-600 text-white font-bold rounded-md text-sm uppercase px-5 py-2 shadow-lg z-50">
        Promo Eksklusif
      </div>

      {/* Slider Container */}
      <div className="relative overflow-visible px-4 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <motion.div
              className={`bg-white border-l-4 ${currentPromo.accentColor} rounded-xl p-6 shadow-md`}
              whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              {/* Badge */}
              <motion.div
                className={`${currentPromo.badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentPromo.badge}
              </motion.div>

              {/* Title */}
              <motion.h4
                className="text-xl font-bold text-gray-800 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {currentPromo.title}
              </motion.h4>
              <motion.p
                className="text-gray-500 text-sm mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {currentPromo.subtitle}
              </motion.p>

              {/* Pricing */}
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-xs line-through">
                    {currentPromo.originalPrice}
                  </span>
                  <motion.span
                    className="text-red-500 text-xs font-bold uppercase"
                    animate={{
                      scale: [1, 1.1, 1],
                      color: ["#ef4444", "#dc2626", "#ef4444"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    Save
                  </motion.span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-gray-600 text-xs">Mulai dari</span>
                  <motion.span
                    className="text-2xl font-extrabold text-gray-900"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {currentPromo.discountPrice}
                  </motion.span>
                  <span className="text-gray-600 text-xs">
                    {currentPromo.unit}
                  </span>
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h5 className="text-gray-700 font-semibold text-sm uppercase mb-2">
                  Yang Anda Dapatkan:
                </h5>
                <motion.ul
                  className="space-y-2 ml-3 text-gray-600 text-sm"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {currentPromo.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start space-x-2"
                      variants={fadeInUp}
                      whileHover={{ x: 5 }}
                    >
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>

              {/* Suitable */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                  {currentPromo.suitable}
                </span>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow relative z-10 flex items-center justify-center space-x-2"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                }}
                onClick={() =>
                  redirectToWhatsApp("Halo, saya mau tanya tentang produk")
                }
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                delay={0.7}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">WhatsApp Sekarang</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Nav Buttons */}
        <motion.button
          onClick={prevSlide}
          className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-sm z-50"
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </motion.button>
        <motion.button
          onClick={nextSlide}
          className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-sm z-50"
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>

      {/* Dots */}
      <div className="flex justify-center space-x-2 mt-6">
        {promoData.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-4 h-4 rounded-full transition-colors duration-200 ${
              idx === currentSlide ? "bg-green-600" : "bg-gray-300"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            animate={{
              scale: idx === currentSlide ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Main Hero Component
const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <motion.section
      className="relative min-h-screen flex items-center translate-y-[-10px] justify-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url('/hero-background.webp')`,
        // y,
        // opacity,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Darker Overlay for Improved Contrast */}
      <motion.div
        className="absolute inset-0 bg-black/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      ></motion.div>

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/20">
        {/* Floating Elements */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        ></motion.div>

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        ></motion.div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-full px-6 py-3 backdrop-blur-sm"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-2 h-2 bg-red-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              ></motion.div>
              <span className="text-red-400 font-semibold drop-shadow-lg">
                Sejak 2020 • Terpercaya
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div className="space-y-4" variants={fadeInUp}>
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight drop-shadow-2xl"
                initial={{ opacity: 0, y: 100, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              >
                <motion.span
                  className="bg-gradient-to-r from-red-600 via-red-400 to-red-600 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Sewa Alat
                </motion.span>
                <br />
                <motion.span
                  className="text-white"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Event
                </motion.span>
                <motion.span
                  className="inline-block ml-4 text-4xl drop-shadow-md"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    y: [0, -10, 0, 10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🎯
                </motion.span>
              </motion.h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.p
                className="text-xl lg:text-2xl text-gray-200 leading-relaxed drop-shadow-md"
                variants={fadeInUp}
              >
                <span className="text-red-500 font-bold">
                  Tempat Sewa Multimedia Terbaik
                </span>
                , Proyektor, Screen, TV LED{" "}
                <span className="font-bold">100% Professional!</span>
              </motion.p>
              <motion.p
                className="text-gray-300 text-lg leading-relaxed drop-shadow-sm"
                variants={fadeInUp}
              >
                Solusi lengkap rental multimedia untuk berbagai event di area{" "}
                <span className="font-semibold">
                  Jogja, Bantul, Sleman, Gunung Kidul, Kulonprogo
                </span>{" "}
                dengan layanan terpercaya sejak 2020.
              </motion.p>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[
                { number: "1000+", label: "Happy Customers" },
                { number: "100%", label: "On Time Delivery" },
                { number: "2020", label: "Since" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  variants={scaleIn}
                  whileHover={{
                    scale: 1.1,
                    y: -5,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="text-4xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent drop-shadow-md"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-gray-300 font-medium drop-shadow-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-2xl text-white font-bold flex items-center justify-center space-x-3 shadow-2xl group"
                variants={slideInFromLeft}
                onClick={() =>
                  redirectToWhatsApp("Halo, saya mau tanya tentang produk")
                }
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MessageCircle className="w-6 h-6" />
                </motion.div>
                <span className="drop-shadow-sm">Konsultasi Gratis</span>
              </motion.button>

              <motion.button
                onClick={scrollToNext}
                className="bg-transparent border-2 border-red-500 hover:bg-red-500/10 px-8 py-4 rounded-2xl text-white font-bold flex items-center justify-center space-x-3 group hover:border-red-400 drop-shadow-sm"
                variants={slideInFromRight}
                whileHover={{
                  scale: 1.05,
                  borderColor: "#ef4444",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Play className="w-5 h-5" />
                </motion.div>
                <span>Lihat Produk</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Promo Cards */}
          <div className="lg:pl-8">
            <PromoCards />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group"
        onClick={scrollToNext}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        whileHover={{ y: -5 }}
      >
        <div className="flex flex-col items-center space-y-2 text-gray-400 group-hover:text-white transition-colors duration-300">
          <span className="text-sm font-medium drop-shadow-sm">
            Scroll untuk melihat lebih
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="w-6 h-6 drop-shadow-md" />
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
