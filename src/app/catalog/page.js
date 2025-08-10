// src/app/catalog/page.js
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Search, Eye, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [catalogItems, setCatalogItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const categories = [
    "Semua",
    "Proyektor",
    "TV LED",
    "Speaker",
    "Screen",
    "Flipchart",
    "Megaphone",
  ];

  // Ambil data dari Supabase tabel products
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching catalog:", error);
      } else {
        setCatalogItems(data);
      }
      setLoading(false);
    };

    fetchCatalog();
  }, []);

  const filteredItems = catalogItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const handleProductClick = (item) => {
    localStorage.setItem("selectedProduct", JSON.stringify(item));
    router.push(`/catalog/${item.id}`);
  };

  // Skeleton Loader Card
  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-6 py-3 mb-8"
            >
              <Eye className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Katalog Produk</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Katalog Lengkap
              <br />
              <span className="bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Multimedia MAXPRO
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-8 leading-relaxed"
            >
              Temukan peralatan multimedia terbaik untuk event Anda. Semua
              produk berkualitas premium dengan harga terjangkau dan kelengkapan
              lengkap.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-12 top-0 bg-white/95 backdrop-blur-sm z-40 border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:bg-red-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
              <AnimatePresence mode="wait">
                {loading
                  ? Array.from({ length: 8 }).map((_, idx) => (
                      <SkeletonCard key={idx} />
                    ))
                  : filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                          ease: "easeOut",
                        }}
                        onMouseEnter={() => setHoveredCard(item.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        onClick={() => handleProductClick(item)}
                        className={`group bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 transition-all duration-300 cursor-pointer relative ${
                          hoveredCard === item.id
                            ? "transform -translate-y-1 shadow-xl"
                            : "hover:shadow-lg"
                        }`}
                      >
                        <div className="absolute top-4 left-4 z-30">
                          <div className="bg-white/95 backdrop-blur-sm border border-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                            {item.badge}
                          </div>
                        </div>

                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className={`w-full h-full object-cover transition-transform duration-300 ${
                              hoveredCard === item.id
                                ? "scale-110"
                                : "scale-105"
                            }`}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                          <div
                            className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 z-20 ${
                              hoveredCard === item.id
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          >
                            <div className="flex items-center space-x-2 text-white font-medium">
                              <Eye className="w-5 h-5" />
                              <span>Lihat Detail</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                              {item.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(item.rating)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                {item.rating}/5
                              </span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-gray-400 text-sm line-through">
                                {item.originalPrice}
                              </span>
                              <div className="px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full">
                                Save{" "}
                                {Math.round(
                                  (1 -
                                    parseInt(item.price) /
                                      parseInt(item.originalPrice)) *
                                    100
                                )}
                                %
                              </div>
                            </div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                              {item.price}/hari
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
              </AnimatePresence>
            </div>

            {!loading && filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Produk Tidak Ditemukan
                </h3>
                <p className="text-gray-600 mb-6">
                  Coba ubah kata kunci pencarian atau pilih kategori yang
                  berbeda
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Semua");
                  }}
                  className="bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors duration-200"
                >
                  Reset Filter
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
