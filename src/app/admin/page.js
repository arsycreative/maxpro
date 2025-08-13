// src/app/admin/page.js
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
  Package,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminCatalogManagement() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    originalPrice: "",
    rating: 5,
    description: "",
    image: "",
    features: [],
    badge: "",
    suitable: "",
  });
  const [newFeature, setNewFeature] = useState("");
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    "Semua",
    "Promo",
    "Proyektor",
    "Layar",
    "Audio",
    "Video",
    "Aksesoris",
    "Paket",
    "Kabel",
    "Lainnya",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
    updateStats();
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification("Error mengambil data produk", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== "Semua") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const updateStats = () => {
    const uniqueCategories = [...new Set(products.map((p) => p.category))]
      .length;
    setStats({
      totalProducts: products.length,
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

  // frontend: hanya upload, jangan create bucket di client
  const uploadImage = async (file) => {
    try {
      setUploading(true);

      // Pastikan file punya nama (sudah dibuat di handleImageChange)
      const fileName =
        file.name ||
        `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
      const filePath = `products/${fileName}`;

      // Supabase storage expects File/Blob — kita kirim langsung
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

      // getPublicUrl
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

  // Perbaikan untuk resetForm function
  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      price: "",
      originalPrice: "",
      rating: 5,
      description: "",
      image: "",
      features: [],
      badge: "",
      suitable: "",
    });
    setNewFeature("");
    setEditingProduct(null);
    setImagePreview(null);
  };

  // Perbaikan untuk handleOpenModal function
  const handleOpenModal = (product = null) => {
    if (product) {
      setFormData({
        title: product.title || "",
        category: product.category || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        rating: product.rating || 5,
        description: product.description || "",
        image: product.image || "",
        features: product.features || [],
        badge: product.badge || "",
        suitable: product.suitable || "",
      });
      setEditingProduct(product);
      setImagePreview(product.image || null);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleImageChange = async (e) => {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    // Validasi tipe
    if (!originalFile.type.startsWith("image/")) {
      showNotification("File harus berupa gambar", "error");
      return;
    }

    try {
      setUploading(true);

      // Opsi kompresi (sesuaikan target size / dimensi)
      const options = {
        maxSizeMB: 1, // target ukuran ~ <= 1MB (bisa ubah)
        maxWidthOrHeight: 1600, // maksimal sisi terpanjang
        useWebWorker: true,
        initialQuality: 0.8,
      };

      // Kompresi (menghasilkan File/Blob)
      const compressedBlobOrFile = await imageCompression(
        originalFile,
        options
      );

      // Buat File dengan nama unik agar supabase punya filename
      const fileExt = (originalFile.name || "jpg").split(".").pop();
      const uploadFileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const compressedFile = new File([compressedBlobOrFile], uploadFileName, {
        type: compressedBlobOrFile.type || originalFile.type,
      });

      // Optional: reject bila masih terlalu besar
      if (compressedFile.size > 5 * 1024 * 1024) {
        showNotification(
          "Ukuran file masih lebih dari 5MB setelah kompresi",
          "error"
        );
        setUploading(false);
        return;
      }

      // Preview (object URL lebih cepat daripada FileReader)
      const previewUrl = URL.createObjectURL(compressedFile);
      setImagePreview(previewUrl);

      // Upload ke Supabase (gunakan compressedFile)
      const imageUrl = await uploadImage(compressedFile);
      if (imageUrl) {
        setFormData({ ...formData, image: imageUrl });
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

    if (!formData.title || !formData.category || !formData.price) {
      showNotification("Mohon lengkapi semua field yang wajib", "error");
      return;
    }

    try {
      const productData = {
        ...formData,
        price:
          typeof formData.price === "string"
            ? formData.price.replace(/[^\d]/g, "")
            : String(formData.price).replace(/[^\d]/g, ""),
        originalPrice: formData.originalPrice
          ? typeof formData.originalPrice === "string"
            ? formData.originalPrice.replace(/[^\d]/g, "")
            : String(formData.originalPrice).replace(/[^\d]/g, "")
          : "",
        updated_at: new Date().toISOString(),
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        showNotification("Produk berhasil diperbarui");
      } else {
        const { error } = await supabase
          .from("products")
          .insert([{ ...productData, created_at: new Date().toISOString() }]);

        if (error) throw error;
        showNotification("Produk berhasil ditambahkan");
      }

      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      showNotification("Error menyimpan produk", "error");
    }
  };

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Produk yang dihapus tidak dapat dikembalikan!",
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
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Produk berhasil dihapus",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus produk",
      });
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
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
          {/* Hero Header */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-6 py-3">
              <Package className="w-5 h-5 text-red-600" />
              <span className="text-red-600 font-medium">Admin Dashboard</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Kelola Katalog
              <br />
              <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                MAXPRO Multimedia
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Dashboard admin untuk mengelola semua produk multimedia dengan
              mudah dan efisien
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalProducts}
              </div>
              <div className="text-gray-600">Total Produk</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-gray-900">
                {filteredProducts.length}
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
                    placeholder="Cari produk..."
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
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={() => handleOpenModal()}
              className="bg-white text-red-600 hover:bg-gray-50 px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Produk</span>
            </button>
          </div>
        </motion.div>

        {/* Products Grid */}
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
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Eye className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    {product.badge && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/95 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
                          {product.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {product.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-red-600">
                          {product.price}k/hari
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {product.originalPrice}k
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {product.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
                  Produk Tidak Ditemukan
                </h3>
                <p className="text-gray-600 mb-6">
                  Tidak ada produk yang sesuai dengan pencarian Anda
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
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal for Add/Edit Product */}
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
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
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
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Produk *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white text-gray-900"
                        placeholder="Contoh: Proyektor 2700 Lumens"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white text-gray-900"
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

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Harga Sewa (per hari) *
                      </label>
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white text-gray-900"
                        placeholder="300k"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Harga Asli
                      </label>
                      <input
                        type="text"
                        value={formData.originalPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            originalPrice: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white text-gray-900"
                        placeholder="400k"
                      />
                    </div>
                  </div>

                  {/* Rating & Badge */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <select
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rating: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white text-gray-900"
                      >
                        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Badge
                      </label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) =>
                          setFormData({ ...formData, badge: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white text-gray-900"
                        placeholder="Popular, Premium, dll."
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Produk
                    </label>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none resize-none bg-white text-gray-900"
                      placeholder="Deskripsi lengkap produk..."
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cocok untuk:
                    </label>
                    <input
                      type="text"
                      value={formData.suitable}
                      onChange={(e) =>
                        setFormData({ ...formData, suitable: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white text-gray-900"
                      placeholder="Perfect untuk pameran & meeting room"
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fitur Produk
                    </label>

                    {/* Add Feature */}
                    <div className="flex space-x-2 mb-3">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white text-gray-900"
                        placeholder="Tambah fitur baru..."
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addFeature())
                        }
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah</span>
                      </button>
                    </div>

                    {/* Features List */}
                    {formData.features.length > 0 && (
                      <div className="space-y-2">
                        {formData.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
                          >
                            <span className="text-gray-700">{feature}</span>
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
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
                      className={`flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2 ${
                        uploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Save className="w-5 h-5" />
                      <span>
                        {editingProduct ? "Perbarui" : "Simpan"} Produk
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
