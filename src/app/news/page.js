// src/app/news/page.js
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  Eye,
  ArrowRight,
  User,
  Clock,
  Star,
  Tag,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [newsItems, setNewsItems] = useState([]);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Corporate", "Product", "Tips", "Event"];

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        // Fetch all published news
        const { data: allNews, error: newsError } = await supabase
          .from("news")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (newsError) throw newsError;

        // Fetch featured news
        const { data: featured, error: featuredError } = await supabase
          .from("news")
          .select("*")
          .eq("published", true)
          .eq("featured", true)
          .order("created_at", { ascending: false })
          .limit(3);

        if (featuredError) throw featuredError;

        setNewsItems(allNews || []);
        setFeaturedNews(featured || []);
      } catch (error) {
        console.error("Error fetching news:", error);
        setNewsItems([]);
        setFeaturedNews([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  const filteredItems = newsItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
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

  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
              <TrendingUp className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Berita & Update</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Berita Terbaru
              <br />
              <span className="bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                MAXPRO
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-8 leading-relaxed"
            >
              Dapatkan informasi terbaru tentang produk, teknologi, dan layanan
              multimedia dari MAXPRO. Tips dan panduan untuk event sempurna
              Anda.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-7xl mx-auto"
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Berita Utama
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {featuredNews.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/news/${item.slug}`}>
                      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:-translate-y-2">
                        <div className="relative h-48 overflow-hidden">
                          <div className="absolute top-4 left-4 z-10">
                            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-current" />
                              <span>Featured</span>
                            </span>
                          </div>
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.title}
                              fill
                              sizes="(max-width: 1280px) 100vw, (max-width: 1536px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                              <div className="text-red-500 text-6xl opacity-20">
                                📰
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(item.created_at)}</span>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                            {item.title}
                          </h3>

                          <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                            {item.excerpt}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm text-gray-600">
                                {item.author}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 text-red-600 group-hover:text-red-700 transition-colors duration-300">
                              <span className="text-sm font-medium">
                                Baca Selengkapnya
                              </span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filter & Search Section */}
      <section className="py-12 bg-gray-50/50 border-y border-gray-200">
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
                  placeholder="Cari berita..."
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
                  {category === "All" ? "Semua" : category}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="wait">
                {loading
                  ? Array.from({ length: 6 }).map((_, idx) => (
                      <SkeletonCard key={idx} />
                    ))
                  : filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                        }}
                        className="group"
                      >
                        <Link href={`/news/${item.slug}`}>
                          <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 group-hover:-translate-y-1">
                            <div className="relative h-48 overflow-hidden">
                              <div className="absolute top-4 left-4 z-10">
                                <span className="bg-white/90 backdrop-blur-sm text-red-600 px-3 py-1 rounded-full text-xs font-semibold border border-red-100 shadow-sm">
                                  {item.category}
                                </span>
                              </div>
                              {item.image_url ? (
                                <Image
                                  src={item.image_url}
                                  alt={item.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                  <div className="text-gray-400 text-5xl opacity-30">
                                    📰
                                  </div>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            </div>

                            <div className="p-6">
                              <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(item.created_at)}</span>
                                </div>
                              </div>

                              <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                                {item.title}
                              </h3>

                              <p className="text-gray-600 line-clamp-3 mb-4 text-sm leading-relaxed">
                                {item.excerpt}
                              </p>

                              {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {item.tags.slice(0, 3).map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center space-x-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
                                    >
                                      <Tag className="w-3 h-3" />
                                      <span>{tag}</span>
                                    </span>
                                  ))}
                                  {item.tags.length > 3 && (
                                    <span className="text-xs text-gray-400 px-2 py-1">
                                      +{item.tags.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="w-7 h-7 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <User className="w-3 h-3 text-white" />
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {item.author}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2 text-red-600 group-hover:text-red-700 transition-colors duration-300">
                                  <span className="text-sm font-medium">
                                    Selengkapnya
                                  </span>
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
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
                  Berita Tidak Ditemukan
                </h3>
                <p className="text-gray-600 mb-6">
                  Coba ubah kata kunci pencarian atau pilih kategori yang
                  berbeda
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
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
