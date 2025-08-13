"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircle, HelpCircle, Phone } from "lucide-react";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      id: 1,
      question: "Apa saja alat yang disewakan oleh MAXPRO?",
      answer:
        "MAXPRO menyewakan alat multimedia seperti proyektor, screen, TV LED / Smart TV, speaker sound portable, flipchart dan TOA megaphone. Semua peralatan dalam kondisi prima dan siap pakai untuk berbagai jenis acara Anda.",
      category: "Produk",
    },
    {
      id: 2,
      question: "Jenis proyektor dan screen apa saja yang bisa disewa?",
      answer:
        "Kami menyediakan proyektor berbagai lumens dan screen dengan bermacam ukuran berikut:",
      details: [
        "Proyektor 2700 Lumens",
        "Proyektor 3200 Lumens",
        "Proyektor 5000 Lumens",
        "Screen Proyektor Tripod 1,8×1,8m (70 inch)",
        "Screen Proyektor Tripod 2x2m (84 inch)",
        "Screen Proyektor Besar 2x3m (150 inch)",
        "Screen Proyektor Besar 3x4m (200 inch)",
      ],
      category: "Spesifikasi",
    },
    {
      id: 3,
      question: "Apakah lumens itu?",
      answer:
        "Lumens adalah satuan untuk mengukur kecerahan cahaya yang dihasilkan oleh proyektor. Semakin tinggi nilai lumens, semakin terang gambar yang dihasilkan proyektor tersebut. Untuk ruangan gelap 2700 lumens sudah cukup, untuk ruangan terang direkomendasikan 3200+ lumens.",
      category: "Teknis",
    },
    {
      id: 4,
      question:
        "Saya ingin menyewa proyektor, proyektor mana yang harus saya pilih?",
      answer:
        "Silahkan menghubungi admin lalu sampaikan detail acaramu via WhatsApp. Admin akan memberi rekomendasi unit yang tepat sesuai dengan kebutuhan acaramu berdasarkan ukuran ruangan, jumlah peserta, dan kondisi pencahayaan ruangan.",
      category: "Konsultasi",
    },
    {
      id: 5,
      question: "Ukuran TV berapa inch saja yang MAXPRO sewakan?",
      answer:
        "Kami menyewakan TV mulai dari ukuran 32inch, 43 inch, 50 inch, 55 inch, 60 inch, 65 inch, sampai dengan 70 inch. Semua TV menggunakan brand ternama seperti Samsung dan LG dengan kualitas HD hingga 4K.",
      category: "Spesifikasi",
    },
    {
      id: 6,
      question: "Bagaimana prosedur menyewa di MAXPRO?",
      answer:
        "Hubungi admin via WhatsApp, ceritakan secara detail event yang akan dilaksanakan, sampaikan apa saja kebutuhan mu, kami akan rekomendasikan unit yang tepat dan sesuai dengan yang kamu perlukan. Proses booking sangat mudah dan cepat!",
      category: "Prosedur",
    },
  ];

  const categories = [
    "Semua",
    "Produk",
    "Spesifikasi",
    "Teknis",
    "Konsultasi",
    "Prosedur",
  ];
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredFAQs =
    selectedCategory === "Semua"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-100/40 to-purple-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-red-100/40 to-pink-100/40 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
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
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Pertanyaan yang Sering
            <br />
            <span className="bg-gradient-to-r from-red-600 via-red-400 to-red-600 bg-clip-text text-transparent">
              Ditanyakan
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Temukan jawaban untuk pertanyaan umum seputar layanan sewa
            multimedia MAXPRO
          </p>

          <div className="flex items-center justify-center space-x-4">
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
          </div>
        </motion.div>

        {/* Category Filter */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-red-600 to-red-400 text-white shadow-lg"
                  : "bg-white/80 text-gray-600 border border-gray-200 hover:border-red-300 hover:bg-red-50"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div> */}

        <div className="max-w-4xl mx-auto">
          {/* FAQ Items */}
          <div className="space-y-6">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Question Header */}
                <motion.button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-6 lg:p-8 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-300 group"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-red-600 to-red-400 rounded-lg flex items-center justify-center mt-1">
                      <span className="text-white font-bold text-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                        {faq.question}
                      </h3>
                      <div className="mt-2 inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        {faq.category}
                      </div>
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-4"
                  >
                    {activeIndex === index ? (
                      <Minus className="w-6 h-6 text-red-500" />
                    ) : (
                      <Plus className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
                    )}
                  </motion.div>
                </motion.button>

                {/* Answer Content */}
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                        <div className="pl-12">
                          <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-6 border-l-4 border-red-500">
                            <p className="text-gray-700 leading-relaxed mb-4">
                              {faq.answer}
                            </p>

                            {faq.details && (
                              <div className="space-y-2">
                                {faq.details.map((detail, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center space-x-3 text-gray-600"
                                  >
                                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                    <span className="text-sm">{detail}</span>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          {/* <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-br from-red-500/5 via-pink-500/5 to-orange-500/5 rounded-3xl p-8 lg:p-12 border border-red-100">
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-400 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  Masih Ada Pertanyaan?
                </h3>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Tim customer service kami siap membantu 24/7 untuk menjawab
                  pertanyaan dan memberikan konsultasi gratis seputar kebutuhan
                  multimedia event Anda.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href="https://wa.me/6285712165658"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat WhatsApp</span>
                  </motion.a>
                </div>

                <div className="mt-6 text-sm text-gray-500">
                  Hubungi kami sekarang untuk mendapatkan penawaran terbaik!
                </div>
              </div>
            </div>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}
