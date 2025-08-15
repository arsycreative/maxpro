// src/app/admin/gallery/page.js
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
  X,
  Save,
  AlertCircle,
  Check,
  ImageIcon,
  Upload,
  Calendar,
  MapPin,
  Tag,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminGalleryManagement() {
  const [galleries, setGalleries] = useState([]);
  const [filteredGalleries, setFilteredGalleries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image_url: "",
    image_path: "",
    event_date: "",
    location: "",
    description: "",
    equipment: [],
  });
  const [newEquipment, setNewEquipment] = useState("");
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    totalGalleries: 0,
    totalCategories: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    "Semua",
    "Event",
    "Wedding",
    "Corporate",
    "Conference",
    "Exhibition",
    "Concert",
    "Training",
    "Workshop",
    "Lainnya",
  ];

  // Fetch galleries on mount
  useEffect(() => {
    fetchGalleries();
  }, []);

  // Update filtered list & stats when dependencies change
  useEffect(() => {
    filterGalleries();
    updateStats();
  }, [galleries, searchTerm, selectedCategory]);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGalleries(data ?? []);
    } catch (error) {
      console.error("Error fetching galleries:", error);
      showNotification("Error mengambil data galeri", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterGalleries = () => {
    let filtered = galleries;

    if (selectedCategory && selectedCategory !== "Semua") {
      filtered = filtered.filter((g) => g.category === selectedCategory);
    }

    if (searchTerm && searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(
        (g) =>
          (g.title || "").toLowerCase().includes(q) ||
          (g.description || "").toLowerCase().includes(q)
      );
    }

    setFilteredGalleries(filtered);
  };

  const updateStats = () => {
    const uniqueCategories = [
      ...new Set(galleries.map((g) => g.category).filter(Boolean)),
    ].length;
    setStats({
      totalGalleries: galleries.length,
      totalCategories: uniqueCategories,
    });
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
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
      const filePath = `gallery/${fileName}`;

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

      return {
        url: publicData?.publicUrl ?? null,
        path: filePath,
      };
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
      category: "",
      image_url: "",
      image_path: "",
      event_date: "",
      location: "",
      description: "",
      equipment: [],
    });
    setNewEquipment("");
    setEditingGallery(null);
    if (imagePreview && imagePreview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(imagePreview);
      } catch (e) {}
    }
    setImagePreview(null);
  };

  const handleOpenModal = (gallery = null) => {
    if (gallery) {
      setFormData({
        title: gallery.title || "",
        category: gallery.category || "",
        image_url: gallery.image_url || "",
        image_path: gallery.image_path || "",
        event_date: gallery.event_date || "",
        location: gallery.location || "",
        description: gallery.description || "",
        equipment: gallery.equipment || [],
      });
      setEditingGallery(gallery);
      setImagePreview(gallery.image_url || null);
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

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
        initialQuality: 0.8,
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

      // safety check size
      if (compressedFile.size > 5 * 1024 * 1024) {
        showNotification(
          "Ukuran file masih lebih dari 5MB setelah kompresi",
          "error"
        );
        setUploading(false);
        return;
      }

      // preview
      const previewUrl = URL.createObjectURL(compressedFile);
      setImagePreview(previewUrl);

      // upload to storage
      const uploadResult = await uploadImage(compressedFile);
      if (uploadResult) {
        setFormData((prev) => ({
          ...prev,
          image_url: uploadResult.url,
          image_path: uploadResult.path,
        }));
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

    if (!formData.title || !formData.category) {
      showNotification("Mohon lengkapi semua field yang wajib", "error");
      return;
    }

    try {
      const galleryData = {
        title: formData.title,
        category: formData.category,
        image_url: formData.image_url || null,
        image_path: formData.image_path || null,
        event_date: formData.event_date || null,
        location: formData.location || null,
        description: formData.description || null,
        equipment: formData.equipment || [],
        updated_at: new Date().toISOString(),
      };

      if (editingGallery) {
        const { error } = await supabase
          .from("gallery")
          .update(galleryData)
          .eq("id", editingGallery.id);

        if (error) throw error;
        showNotification("Galeri berhasil diperbarui", "success");
      } else {
        const { error } = await supabase
          .from("gallery")
          .insert([{ ...galleryData, created_at: new Date().toISOString() }]);

        if (error) throw error;
        showNotification("Galeri berhasil ditambahkan", "success");
      }

      handleCloseModal();
      fetchGalleries();
    } catch (error) {
      console.error("Error saving gallery:", error);
      showNotification("Error menyimpan galeri", "error");
    }
  };

  const handleDelete = async (galleryId) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Galeri yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7f1d1d",
      cancelButtonColor: "#374151",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", galleryId);

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Galeri berhasil dihapus",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchGalleries();
    } catch (error) {
      console.error("Error deleting gallery:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus galeri",
      });
    }
  };

  const addEquipment = () => {
    if (newEquipment.trim()) {
      setFormData((prev) => ({
        ...prev,
        equipment: [...(prev.equipment || []), newEquipment.trim()],
      }));
      setNewEquipment("");
    }
  };

  const removeEquipment = (index) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index),
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    try {
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
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
                : "bg-red-600 text-white"
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
          {/* Hero Header */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-red-900/10 border border-red-900/20 rounded-full px-6 py-3">
              <ImageIcon className="w-5 h-5 text-red-800" />
              <span className="text-red-800 font-medium">Gallery Manager</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Kelola Galeri
              <br />
              <span className="bg-gradient-to-r from-red-900 via-red-700 to-red-600 bg-clip-text text-transparent">
                MAXPRO Events
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Dashboard admin untuk mengelola dokumentasi event dan projek
              multimedia dengan mudah
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalGalleries}
              </div>
              <div className="text-gray-600">Total Galeri</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-gray-900">
                {filteredGalleries.length}
              </div>
              <div className="text-gray-600">Ditampilkan</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalCategories}
              </div>
              <div className="text-gray-600">Kategori</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-gray-900">
                {categories.length - 1}
              </div>
              <div className="text-gray-600">Tersedia</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Controls Section (red gradient) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-red-900 via-red-800 to-red-700 rounded-2xl p-6"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full lg:w-auto">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/80" />
                  <input
                    type="text"
                    placeholder="Cari galeri..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none bg-white/10 text-white placeholder-white/70 backdrop-blur-sm"
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
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={() => handleOpenModal()}
              className="bg-white text-red-800 hover:bg-red-50 px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Galeri</span>
            </button>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              [...Array(8)].map((_, i) => (
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
            ) : filteredGalleries.length > 0 ? (
              filteredGalleries.map((gallery, index) => (
                <motion.div
                  key={gallery.id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  {/* Gallery Image */}
                  <div className="relative h-48 bg-gray-100">
                    {gallery.image_url ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={gallery.image_url}
                          alt={gallery.title || "Gallery image"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 400px"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span className="bg-white/95 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                        {gallery.category || "Lainnya"}
                      </span>
                    </div>
                  </div>

                  {/* Gallery Info */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                        {gallery.title}
                      </h3>

                      {gallery.event_date && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(gallery.event_date)}</span>
                        </div>
                      )}

                      {gallery.location && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{gallery.location}</span>
                        </div>
                      )}
                    </div>

                    {gallery.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {gallery.description}
                      </p>
                    )}

                    {gallery.equipment && gallery.equipment.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
                          <Tag className="w-4 h-4" />
                          <span>Equipment:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {gallery.equipment.slice(0, 3).map((item, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              {item}
                            </span>
                          ))}
                          {gallery.equipment.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{gallery.equipment.length - 3} lainnya
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(gallery)}
                        className="flex-1 bg-gradient-to-r from-red-800 to-red-700 text-white px-4 py-2 rounded-lg font-medium hover:from-red-700 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(gallery.id)}
                        className="flex-1 bg-gradient-to-r from-red-700 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-500 transition-all duration-200 flex items-center justify-center space-x-2"
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
                  Galeri Tidak Ditemukan
                </h3>
                <p className="text-gray-600 mb-6">
                  Tidak ada galeri yang sesuai dengan pencarian Anda
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Semua");
                  }}
                  className="bg-red-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal for Add/Edit Gallery */}
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingGallery ? "Edit Galeri" : "Tambah Galeri Baru"}
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
                  {/* Basic Info: Title + Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Judul Galeri *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-600 outline-none bg-white text-gray-900"
                        placeholder="Contoh: Hotel Grand Savoy, Bandung"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-600 outline-none bg-white text-gray-900"
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        {categories
                          .filter((cat) => cat !== "Semua")
                          .map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Galeri
                    </label>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-4 relative w-full h-48 rounded-lg border border-gray-300 overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                          sizes="100vw"
                          unoptimized
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
                              <div className="w-5 h-5 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
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
                      Format yang didukung: JPG, PNG, GIF. Maksimal 5MB.
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-600 outline-none resize-none bg-white text-gray-900"
                      placeholder="Deskripsi detail tentang event atau project ini..."
                    />
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Event
                      </label>
                      <input
                        type="date"
                        value={formData.event_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            event_date: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-600 outline-none bg-white text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-600 outline-none bg-white text-gray-900"
                        placeholder="Contoh: Bandung, Jawa Barat"
                      />
                    </div>
                  </div>

                  {/* Equipment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment yang Digunakan
                    </label>

                    {/* Add Equipment */}
                    <div className="flex space-x-2 mb-3">
                      <input
                        type="text"
                        value={newEquipment}
                        onChange={(e) => setNewEquipment(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-600 outline-none bg-white text-gray-900"
                        placeholder="Tambah equipment baru..."
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addEquipment())
                        }
                      />
                      <button
                        type="button"
                        onClick={addEquipment}
                        className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah</span>
                      </button>
                    </div>

                    {/* Equipment List */}
                    {formData.equipment && formData.equipment.length > 0 && (
                      <div className="space-y-2">
                        {formData.equipment.map((equipment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
                          >
                            <span className="text-gray-700">{equipment}</span>
                            <button
                              type="button"
                              onClick={() => removeEquipment(index)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200"
                            >
                              <X className="w-4 h-4" />
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
                      className={`flex-1 bg-gradient-to-r from-red-800 to-red-700 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2 ${
                        uploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Save className="w-5 h-5" />
                      <span>
                        {editingGallery ? "Perbarui" : "Simpan"} Galeri
                      </span>
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
