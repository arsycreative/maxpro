// src/app/news/[slug]/page.js
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Eye,
  User,
  Clock,
  Share2,
  ArrowLeft,
  Tag,
  MessageCircle,
  ThumbsUp,
  BookOpen,
  ChevronRight,
  Home,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { redirectToWhatsApp } from "@/app/utils/whatsapp";

export default function NewsDetailPage() {
  const [newsItem, setNewsItem] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);

  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  useEffect(() => {
    if (slug) {
      fetchNewsDetail();
    }
  }, [slug]);

  async function fetchNewsDetail() {
    setLoading(true);
    try {
      // Fetch main news item
      const { data: news, error: newsError } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (newsError) throw newsError;

      setNewsItem(news);

      // Calculate reading time (average 200 words per minute)
      const wordCount = news.content.split(" ").length;
      const readTime = Math.ceil(wordCount / 200);
      setReadingTime(readTime);

      // Update view count
      await supabase
        .from("news")
        .update({ views: (news.views || 0) + 1 })
        .eq("id", news.id);

      // Fetch related news
      const { data: related, error: relatedError } = await supabase
        .from("news")
        .select("*")
        .eq("published", true)
        .eq("category", news.category)
        .neq("id", news.id)
        .limit(3)
        .order("created_at", { ascending: false });

      if (!relatedError) {
        setRelatedNews(related || []);
      }
    } catch (error) {
      console.error("Error fetching news detail:", error);
      // Redirect to news page if not found
      router.push("/news");
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsItem.title,
        text: newsItem.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback to WhatsApp share
      const shareText = `${newsItem.title}\n\n${window.location.href}`;
      redirectToWhatsApp(shareText);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat berita...</p>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Berita Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            Berita yang Anda cari tidak ditemukan atau sudah dihapus.
          </p>
          <Link
            href="/news"
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Kembali ke Halaman Berita
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Article Header */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200 mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali</span>
              </button>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {newsItem.category}
                </span>
                {newsItem.featured && (
                  <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <span>⭐</span>
                    <span>Featured</span>
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {newsItem.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {newsItem.excerpt}
              </p>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {newsItem.author}
                    </p>
                    <p className="text-xs text-gray-500">Author</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(newsItem.created_at)}</span>
                </div>
              </div>

              {/* Tags */}
              {newsItem.tags && newsItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {newsItem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {newsItem.image_url && (
        <section className="py-8 bg-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="container mx-auto px-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="relative h-64 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={newsItem.image_url}
                  alt={newsItem.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-800 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{
                  __html: newsItem.content
                    .replace(/\n\n/g, "</p><p>")
                    .replace(/\n/g, "<br>")
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                }}
              />
            </div>

            {/* Article Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() =>
                      redirectToWhatsApp(
                        `Saya tertarik dengan berita: ${newsItem.title}\n\n${window.location.href}`
                      )
                    }
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Diskusi via WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
              className="max-w-7xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Berita Terkait
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedNews.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="group"
                  >
                    <Link href={`/news/${item.slug}`}>
                      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 group-hover:-translate-y-1">
                        <div className="relative h-48 overflow-hidden">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur-sm text-red-600 px-3 py-1 rounded-full text-xs font-semibold border border-red-100">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(item.created_at)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{item.views || 0}</span>
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                            {item.title}
                          </h3>

                          <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
                            {item.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/news"
                  className="inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200"
                >
                  <span>Lihat Semua Berita</span>
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
