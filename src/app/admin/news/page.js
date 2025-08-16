// src/app/admin/news/page.js
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import imageCompression from "browser-image-compression";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  Star,
  X,
  Save,
  AlertCircle,
  Check,
  FileText,
  Upload,
  Calendar,
  User,
  Tag,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function AdminNewsManagement() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    author: "Admin MAXPRO",
    published: false,
    featured: false,
    category: "General",
    tags: [],
  });
  const [newTag, setNewTag] = useState("");
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    totalNews: 0,
    publishedNews: 0,
    featuredNews: 0,
    draftNews: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    "Semua",
    "General",
    "Corporate",
    "Product",
    "Tips",
    "Event",
    "Technology",
    "Tutorial",
  ];

  const statusOptions = ["Semua", "Published", "Draft"];

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
    updateStats();
  }, [news, searchTerm, selectedCategory, selectedStatus]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      showNotification("Error mengambil data berita", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = news;

    if (selectedCategory !== "Semua") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (selectedStatus !== "Semua") {
      const isPublished = selectedStatus === "Published";
      filtered = filtered.filter((item) => item.published === isPublished);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNews(filtered);
  };

  const updateStats = () => {
    setStats({
      totalNews: news.length,
      publishedNews: news.filter((item) => item.published).length,
      featuredNews: news.filter((item) => item.featured).length,
      draftNews: news.filter((item) => !item.published).length,
    });
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const uploadImage = async (file) => {
    try {
      setUploading(true);

      const fileExt = (file.name || "jpg").split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `news/${fileName}`;

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        if (error.status === 404) {
          showNotification(
            "Bucket 'product-images' tidak ditemukan. Buat bucket lewat Supabase Dashboard.",
            "error"
          );
        } else if (error.status === 403) {
          showNotification(
            "Akses ditolak (403). Periksa policy/bucket permissions di Supabase.",
            "error"
          );
        } else {
          showNotification(
            `Upload error: ${error.message ?? "unknown"}`,
            "error"
          );
        }
        return null;
      }

      const { data: publicData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      return publicData?.publicUrl ?? null;
    } catch (err) {
      console.error("Error uploading image:", err);
      showNotification("Terjadi kesalahan saat upload gambar", "error");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image_url: "",
      author: "Admin MAXPRO",
      published: false,
      featured: false,
      category: "General",
      tags: [],
    });
    setNewTag("");
    setEditingNews(null);
    if (imagePreview && imagePreview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(imagePreview);
      } catch (e) {}
    }
    setImagePreview(null);
  };

  const handleOpenModal = (newsItem = null) => {
    if (newsItem) {
      setFormData({
        title: newsItem.title || "",
        slug: newsItem.slug || "",
        excerpt: newsItem.excerpt || "",
        content: newsItem.content || "",
        image_url: newsItem.image_url || "",
        author: newsItem.author || "Admin MAXPRO",
        published: newsItem.published || false,
        featured: newsItem.featured || false,
        category: newsItem.category || "General",
        tags: newsItem.tags || [],
      });
      setEditingNews(newsItem);
      setImagePreview(newsItem.image_url || null);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleImageChange = async (e) => {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    if (!originalFile.type.startsWith("image/")) {
      showNotification("File harus berupa gambar", "error");
      return;
    }

    try {
      setUploading(true);

      // Compression options - more aggressive for news images
      const options = {
        maxSizeMB: 0.8, // Target smaller size for faster loading
        maxWidthOrHeight: 1200, // Smaller max dimension
        useWebWorker: true,
        initialQuality: 0.7, // Lower initial quality
      };

      const compressedBlobOrFile = await imageCompression(
        originalFile,
        options
      );

      const fileExt = (originalFile.name || "jpg").split(".").pop();
      const uploadFileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const compressedFile = new File([compressedBlobOrFile], uploadFileName, {
        type: compressedBlobOrFile.type || originalFile.type,
      });

      if (compressedFile.size > 3 * 1024 * 1024) {
        showNotification(
          "Ukuran file masih lebih dari 3MB setelah kompresi",
          "error"
        );
        setUploading(false);
        return;
      }

      const previewUrl = URL.createObjectURL(compressedFile);
      setImagePreview(previewUrl);

      const imageUrl = await uploadImage(compressedFile);
      if (imageUrl) {
        setFormData({ ...formData, image_url: imageUrl });
        showNotification("Gambar berhasil diupload", "success");
      }
    } catch (err) {
      console.error("Error kompresi/upload gambar:", err);
      showNotification("Terjadi kesalahan saat memproses gambar", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      showNotification("Mohon lengkapi judul dan konten", "error");
      return;
    }

    // Auto-generate slug if empty
    const finalSlug = formData.slug || generateSlug(formData.title);

    try {
      const newsData = {
        title: formData.title,
        slug: finalSlug,
        excerpt: formData.excerpt || null,
        content: formData.content,
        image_url: formData.image_url || null,
        author: formData.author || "Admin MAXPRO",
        published: formData.published,
        featured: formData.featured,
        category: formData.category,
        tags: formData.tags.length > 0 ? formData.tags : null,
        updated_at: new Date().toISOString(),
      };

      if (editingNews) {
        const { error } = await supabase
          .from("news")
          .update(newsData)
          .eq("id", editingNews.id);

        if (error) throw error;
        showNotification("Berita berhasil diperbarui");
      } else {
        const { error } = await supabase
          .from("news")
          .insert([{ ...newsData, created_at: new Date().toISOString() }]);

        if (error) throw error;
        showNotification("Berita berhasil ditambahkan");
      }

      handleCloseModal();
      fetchNews();
    } catch (error) {
      console.error("Error saving news:", error);
      showNotification("Error menyimpan berita", "error");
    }
  };

  const handleDelete = async (newsId) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Berita yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await supabase.from("news").delete().eq("id", newsId);

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Berita berhasil dihapus",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus berita",
      });
    }
  };

  const togglePublished = async (newsItem) => {
    try {
      const { error } = await supabase
        .from("news")
        .update({
          published: !newsItem.published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", newsItem.id);

      if (error) throw error;

      showNotification(
        `Berita ${!newsItem.published ? "dipublikasi" : "disembunyikan"}`,
        "success"
      );
      fetchNews();
    } catch (error) {
      console.error("Error toggling published:", error);
      showNotification("Error mengubah status publikasi", "error");
    }
  };

  const toggleFeatured = async (newsItem) => {
    try {
      const { error } = await supabase
        .from("news")
        .update({
          featured: !newsItem.featured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", newsItem.id);

      if (error) throw error;

      showNotification(
        `Berita ${
          !newsItem.featured ? "dijadikan unggulan" : "dihapus dari unggulan"
        }`,
        "success"
      );
      fetchNews();
    } catch (error) {
      console.error("Error toggling featured:", error);
      showNotification("Error mengubah status unggulan", "error");
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
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

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="flex items-center space-x-2">
              {notification.type === "success" ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center space-y-6"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-6 py-3">
              <FileText className="w-5 h-5 text-red-600" />
              <span className="text-red-600 font-medium">News Manager</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Kelola Berita
              <br />
              <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                MAXPRO
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Dashboard admin untuk mengelola artikel, berita, dan konten
              informatif dengan mudah
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalNews}
              </div>
              <div className="text-gray-600">Total Berita</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-green-600">
                {stats.publishedNews}
              </div>
              <div className="text-gray-600">Dipublikasi</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-yellow-600">
                {stats.featuredNews}
              </div>
              <div className="text-gray-600">Unggulan</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-gray-500">
                {stats.draftNews}
              </div>
              <div className="text-gray-600">Draft</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 rounded-2xl p-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1 w-full lg:w-auto">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari berita..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none bg-white/10 text-white placeholder-white/60 backdrop-blur-sm"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-white/80" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none bg-white/10 text-white backdrop-blur-sm"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="text-gray-900 bg-white"
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none bg-white/10 text-white backdrop-blur-sm"
                  >
                    {statusOptions.map((status) => (
                      <option
                        key={status}
                        value={status}
                        className="text-gray-900 bg-white"
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={() => handleOpenModal()}
              className="bg-white text-red-600 hover:bg-gray-50 px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Berita</span>
            </button>
          </div>
        </motion.div>

        {/* News Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-lg animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  </div>
                </div>
              ))
            ) : filteredNews.length > 0 ? (
              filteredNews.map((newsItem, index) => (
                <motion.div
                  key={newsItem.id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  {/* News Image */}
                  <div className="relative h-48 bg-gray-100">
                    {newsItem.image_url ? (
                      <img
                        src={newsItem.image_url}
                        alt={newsItem.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          newsItem.published
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {newsItem.published ? "Published" : "Draft"}
                      </span>
                      {newsItem.featured && (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* News Info */}
                  <div className="p-6">
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-red-600 font-medium">
                          {newsItem.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(newsItem.created_at)}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
                        {newsItem.title}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{newsItem.author}</span>
                      </div>
                    </div>

                    {newsItem.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {newsItem.excerpt}
                      </p>
                    )}

                    {newsItem.tags && newsItem.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {newsItem.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center space-x-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
                            >
                              <Tag className="w-3 h-3" />
                              <span>{tag}</span>
                            </span>
                          ))}
                          {newsItem.tags.length > 3 && (
                            <span className="text-xs text-gray-400 px-2 py-1">
                              +{newsItem.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => togglePublished(newsItem)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          newsItem.published
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {newsItem.published ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                        <span>
                          {newsItem.published ? "Published" : "Draft"}
                        </span>
                      </button>

                      <button
                        onClick={() => toggleFeatured(newsItem)}
                        className={`p-2 rounded-lg transition-colors ${
                          newsItem.featured
                            ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            newsItem.featured ? "fill-current" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(newsItem)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(newsItem.id)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-lg font-medium hover:from-red-700 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Berita Tidak Ditemukan
                </h3>
                <p className="text-gray-600 mb-6">
                  Tidak ada berita yang sesuai dengan pencarian Anda
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Semua");
                    setSelectedStatus("Semua");
                  }}
                  className="bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors duration-200"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal for Add/Edit News */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingNews ? "Edit Berita" : "Tambah Berita Baru"}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="bg-white">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Title and Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Judul Berita *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setFormData({
                            ...formData,
                            title,
                            slug: formData.slug || generateSlug(title),
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white text-gray-900"
                        placeholder="Contoh: MAXPRO Luncurkan Layanan Terbaru"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug (URL)
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white text-gray-900"
                        placeholder="maxpro-luncurkan-layanan-terbaru"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Otomatis dibuat dari judul jika kosong
                      </p>
                    </div>
                  </div>

                  {/* Category and Author */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white text-gray-900"
                      >
                        {categories
                          .filter((cat) => cat !== "Semua")
                          .map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Penulis
                      </label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) =>
                          setFormData({ ...formData, author: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white text-gray-900"
                        placeholder="Admin MAXPRO"
                      />
                    </div>
                  </div>

                  {/* Status Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="published"
                        checked={formData.published}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            published: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label
                        htmlFor="published"
                        className="text-sm font-medium text-gray-700"
                      >
                        Publikasikan berita
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            featured: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label
                        htmlFor="featured"
                        className="text-sm font-medium text-gray-700"
                      >
                        Jadikan berita unggulan
                      </label>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Berita
                    </label>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-4 relative w-full h-48">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all duration-200 ${
                          uploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <div className="text-center">
                          {uploading ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-gray-600">
                                Mengupload...
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Upload className="w-5 h-5 text-gray-500" />
                              <span className="text-gray-600">
                                {imagePreview
                                  ? "Ganti Gambar"
                                  : "Upload Gambar"}
                              </span>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Format yang didukung: JPG, PNG, GIF. Maksimal 3MB (akan
                      dikompres otomatis).
                    </p>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ringkasan/Excerpt
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none resize-none bg-white text-gray-900"
                      placeholder="Ringkasan singkat berita yang akan tampil di halaman utama..."
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konten Berita *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none resize-none bg-white text-gray-900"
                      placeholder="Tulis konten lengkap berita di sini..."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Gunakan paragraf untuk memisahkan konten
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>

                    {/* Add Tag */}
                    <div className="flex space-x-2 mb-3">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white text-gray-900"
                        placeholder="Tambah tag baru..."
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah</span>
                      </button>
                    </div>

                    {/* Tags List */}
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                          >
                            <Tag className="w-3 h-3" />
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className={`flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2 ${
                        uploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Save className="w-5 h-5" />
                      <span>{editingNews ? "Perbarui" : "Simpan"} Berita</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
