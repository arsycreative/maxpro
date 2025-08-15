// src/app/gallery/page.js
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Camera,
  Grid3X3,
  List,
  Calendar,
  MapPin,
  Play,
} from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("event_date", { ascending: false });
      if (error) {
        console.error(error);
      } else {
        setGalleryItems(data);
      }
      setLoading(false);
    }
    fetchGallery();
  }, []);

  const SkeletonGrid = ({ count = 8 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
        >
          <div className="w-full aspect-[3/2] bg-gradient-to-r from-gray-200 to-gray-300 shimmer" />
          <div className="p-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );

  // Kategori yang lebih umum dan tidak terlalu banyak
  const categories = [
    "Semua",
    "Corporate",
    "Wedding",
    "Event",
    "Exhibition",
    "Workshop",
    "Entertainment",
  ];

  const filteredItems = galleryItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openLightbox = (item, index) => {
    setSelectedImage(item);
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % filteredItems.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredItems[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex =
      (currentImageIndex - 1 + filteredItems.length) % filteredItems.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredItems[prevIndex]);
  };

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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedImage) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedImage, currentImageIndex]);

  if (loading) return <SkeletonGrid count={8} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        {/* Background Effects */}
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
              <Camera className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Galeri Foto</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Galeri Event
              <br />
              <span className="bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                MAXPRO
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-8 leading-relaxed"
            >
              Dokumentasi setup multimedia profesional dari berbagai event yang
              telah kami layani. Lihat kualitas kerja dan kepuasan client kami.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center space-x-6 text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>{galleryItems.length}+ Photos</span>
              </div>
              <div className="w-px h-6 bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-green-400" />
                <span>HD Quality</span>
              </div>
              <div className="w-px h-6 bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-yellow-400" />
                <span>Recent Updates</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-12 bg-white/95 backdrop-blur-sm z-40 border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar & View Mode Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row gap-4 mb-8 items-center justify-between"
            >
              <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari event atau lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Tampilan:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-red-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-red-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
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

      {/* Gallery Grid/List */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {viewMode === "grid" ? (
              // Grid View - Fokus pada Foto
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => openLightbox(item, index)}
                      className="group cursor-pointer"
                    >
                      {/* Foto sebagai fokus utama */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        {/* Category Badge */}
                        <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                          <span className="bg-red-500/90 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold shadow-lg">
                            {item.category}
                          </span>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                              <Eye className="w-4 h-4 sm:w-6 sm:h-6" />
                            </div>
                            <p className="text-xs sm:text-sm font-medium">
                              Lihat Detail
                            </p>
                          </div>
                        </div>

                        {/* Info Overlay - Selalu terlihat di bawah */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 text-white">
                          <h3 className="font-bold text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2 drop-shadow-lg">
                            {item.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs sm:text-sm opacity-90">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">
                                {item.event_date}
                              </span>
                              <span className="sm:hidden">
                                {item.event_date.split(" ")[0]}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="truncate max-w-16 sm:max-w-24">
                                {item.location.split(" ")[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              // List View - Horizontal Layout
              <div className="space-y-8">
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => openLightbox(item, index)}
                      className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    >
                      <div className="flex flex-col lg:flex-row">
                        {/* Foto besar di list view */}
                        <div className="relative w-full lg:w-96 aspect-[4/3] lg:aspect-auto lg:h-64 flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 400px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 p-8">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              {item.title}
                            </h3>
                            <Eye className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
                          </div>

                          <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                            {item.description}
                          </p>

                          <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center space-x-3 text-gray-600">
                              <Calendar className="w-5 h-5 text-red-500" />
                              <span className="font-medium">
                                {item.event_date}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                              <MapPin className="w-5 h-5 text-red-500" />
                              <span className="font-medium">
                                {item.location}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">
                              Equipment Used:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {item.equipment.map((eq, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gradient-to-r from-red-50 to-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium border border-red-200"
                                >
                                  {eq}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Tidak Ada Hasil
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
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Reset Filter
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl overflow-hidden max-w-6xl w-full shadow-2xl max-h-[95vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Section */}
              <div className="relative flex-shrink-0">
                <div className="relative w-full h-[50vh] min-h-[300px] max-h-[500px]">
                  <Image
                    src={selectedImage.image_url}
                    alt={selectedImage.title}
                    fill
                    sizes="(max-width: 1536px) 100vw, 1536px"
                    className="object-cover"
                    priority
                  />
                </div>

                <button
                  onClick={closeLightbox}
                  className="absolute top-6 right-6 bg-black/70 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/80 transition-all duration-200 z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/80 transition-all duration-200 z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/80 transition-all duration-200 z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Content Section - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex-1 pr-4">
                    {selectedImage.title}
                  </h2>
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg flex-shrink-0">
                    {selectedImage.category}
                  </span>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed text-base md:text-lg">
                  {selectedImage.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="font-medium">
                      {selectedImage.event_date}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="font-medium">
                      {selectedImage.location}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Equipment Used:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.equipment.map((eq, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-red-50 to-red-100 text-red-700 px-3 py-1 md:px-4 md:py-2 rounded-full text-sm font-semibold border border-red-200"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-center text-gray-500 border-t pt-4 mt-6">
                  <span className="text-sm font-medium">
                    {currentImageIndex + 1} dari {filteredItems.length} foto
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
