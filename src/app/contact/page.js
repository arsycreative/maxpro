// src/app/contact/page.js
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  ExternalLink,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  Star,
} from "lucide-react";

export default function ContactPage() {
  const [copiedText, setCopiedText] = useState("");

  const contactInfo = {
    whatsapp: {
      number: "6285712165658",
      displayNumber: "+62 857-1216-5658",
      link: "https://wa.me/6285712165658",
      message:
        "Halo MAXPRO! Saya ingin konsultasi sewa multimedia untuk acara saya.",
    },
    rentalLink: {
      url: "https://whatsform.com/10Gv8D",
      title: "Portal Penyewaan Online",
    },
  };

  const operatingHours = [
    { day: "Senin - Jumat", time: "08:00 - 20:00 WIB" },
    { day: "Sabtu - Minggu", time: "09:00 - 18:00 WIB" },
    { day: "Hari Libur", time: "10:00 - 16:00 WIB" },
  ];

  const serviceAreas = [
    "Yogyakarta Kota",
    "Bantul",
    "Sleman",
    "Gunung Kidul",
    "Kulonprogo",
  ];

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(type);
      setTimeout(() => setCopiedText(""), 2000);
    });
  };

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
              <Phone className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Hubungi Kami</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Siap Melayani
              <br />
              <span className="bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Kebutuhan Anda
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-8 leading-relaxed"
            >
              Tim profesional MAXPRO siap memberikan konsultasi terbaik untuk
              kebutuhan multimedia event Anda. Hubungi kami kapan saja!
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center space-x-6 text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>24/7 Response</span>
              </div>
              <div className="w-px h-6 bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Free Consultation</span>
              </div>
              <div className="w-px h-6 bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Trusted Service</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Pilih Cara <span className="text-red-500">Terbaik</span> untuk
                Menghubungi Kami
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Kami menyediakan berbagai channel komunikasi untuk kemudahan
                Anda
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* WhatsApp Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-3xl p-8 shadow-xl border-2 border-green-100 hover:border-green-300 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    WhatsApp
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Chat langsung dengan admin untuk konsultasi cepat dan
                    booking instant
                  </p>

                  <div className="space-y-4 mb-8">
                    <div
                      onClick={() =>
                        copyToClipboard(
                          contactInfo.whatsapp.displayNumber,
                          "whatsapp"
                        )
                      }
                      className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 group/copy"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-800">
                          {contactInfo.whatsapp.displayNumber}
                        </span>
                        {copiedText === "whatsapp" ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded group-hover/copy:border-green-500 transition-colors duration-200"></div>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        Klik untuk copy nomor
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <motion.a
                      href={contactInfo.whatsapp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Chat Sekarang</span>
                    </motion.a>
                  </div>
                </div>
              </motion.div>

              {/* Rental Link Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <ExternalLink className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Portal Sewa Online
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Akses portal penyewaan online untuk booking langsung dan cek
                    ketersediaan
                  </p>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-8">
                    <div className="text-center">
                      <div className="text-sm text-purple-600 font-medium mb-2">
                        Link Portal
                      </div>
                      <div className="text-lg font-semibold text-gray-800 break-all">
                        {contactInfo.rentalLink.url}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <motion.a
                      href={contactInfo.rentalLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Buka Portal</span>
                    </motion.a>

                    <div className="text-center">
                      <span className="text-sm text-gray-500">
                        Booking 24/7 tersedia
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Operating Hours */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Jam Operasional
                  </h3>
                </div>

                <div className="space-y-4">
                  {operatingHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                    >
                      <span className="text-gray-300 font-medium">
                        {schedule.day}
                      </span>
                      <span className="text-white font-semibold">
                        {schedule.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Response WhatsApp 24/7</span>
                  </div>
                </div>
              </motion.div>

              {/* Service Areas */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Area Layanan
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {serviceAreas.map((area, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300"
                    >
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-gray-300 font-medium">{area}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Siap Membuat Event Anda Berkesan?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Jangan tunggu lagi! Hubungi kami sekarang untuk konsultasi gratis
              dan dapatkan penawaran terbaik.
            </p>

            {/* Dua tombol: utama = WhatsApp, sekunder = Portal Sewa */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href={contactInfo.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-3 bg-white text-red-500 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-lg">Mulai Konsultasi Gratis</span>
              </motion.a>

              <motion.a
                href={contactInfo.rentalLink.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-3 border-2 border-white/30 text-white/95 px-6 py-3 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300"
              >
                <ExternalLink className="w-5 h-5" />
                <span className="text-lg">Cek Portal Sewa</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
