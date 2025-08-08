"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  BoltIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ChatBubbleBottomCenterTextIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function AdvancedAdvantages() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const advantages = [
    {
      id: 1,
      title: "Respon Cepat",
      description: "Cepat tanggap, siap kapanpun dimanapun.",
      icon: BoltIcon,
      gradient: "from-amber-400 via-orange-500 to-red-500",
      position: "top-left",
    },
    {
      id: 2,
      title: "Alat Milik Sendiri",
      description: "Harga terbaik langsung kami tentukan.",
      icon: BuildingOfficeIcon,
      gradient: "from-blue-400 via-indigo-500 to-purple-600",
      position: "top-right",
    },
    {
      id: 3,
      title: "Paling Murah",
      description: "Hemat 30 – 50%.",
      icon: CurrencyDollarIcon,
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      position: "middle-left",
    },
    {
      id: 4,
      title: "Alat Kualitas Terbaik",
      description: "Cek dan ricek unit sebelum disewakan.",
      icon: ShieldCheckIcon,
      gradient: "from-rose-400 via-pink-500 to-purple-600",
      position: "middle-right",
    },
    {
      id: 5,
      title: "Free Konsultasi",
      description: "Free konsultasi event.",
      icon: ChatBubbleBottomCenterTextIcon,
      gradient: "from-cyan-400 via-teal-500 to-blue-600",
      position: "bottom-left",
    },
    {
      id: 6,
      title: "Staf Ahli",
      description: "100% siap melayani.",
      icon: UserGroupIcon,
      gradient: "from-violet-400 via-purple-500 to-indigo-600",
      position: "bottom-right",
    },
  ];

  const features = [
    "1000+ Happy Customer",
    "Fast respon dan ontime",
    "Pengalaman sejak 2022",
    "Kualitas alat terjamin",
  ];

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-black relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Container untuk semua konten */}
      <div className="container mx-auto px-6 relative z-10 py-20">
        {/* Keunggulan Section */}
        <div className="mb-32">
          {/* Compact Header */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-black leading-tight mb-4"
            >
              <span className="text-white/90">Keunggulan</span>{" "}
              <span className="bg-gradient-to-r from-red-600 via-red-400 to-red-500 bg-clip-text text-transparent">
                MAXPRO
              </span>
            </motion.h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Pilihan terbaik untuk kebutuhan multimedia event Anda
            </p>
          </div>

          {/* Compact Grid Layout */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {advantages.map((advantage, index) => (
              <motion.div
                key={advantage.id}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.3 },
                }}
                className="group cursor-pointer"
              >
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500 h-full">
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${advantage.gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-lg transition-all duration-500`}
                  />
                  <div className="relative z-10 text-center">
                    <motion.div
                      whileHover={{ y: -3, rotateY: 180 }}
                      transition={{ duration: 0.4 }}
                      className="mb-4"
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${advantage.gradient} rounded-xl flex items-center justify-center shadow-lg mx-auto`}
                      >
                        <advantage.icon className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors duration-300">
                      {advantage.title}
                    </h3>
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-3" />
                    <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Compact Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl max-w-7xl mx-auto rounded-2xl p-6 border border-white/10">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { number: "1000+", label: "Happy Customers" },
                  { number: "100%", label: "Fast Response" },
                  { number: "2022", label: "Pengalaman Sejak" },
                  { number: "24/7", label: "Kualitas Terjamin" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -3, scale: 1.05 }}
                    className="text-center group"
                  >
                    <div className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-white/60 font-medium text-xs uppercase tracking-wide group-hover:text-white/80 transition-colors duration-300">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Solutions Section */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                {/* Main Images */}
                <div className="relative z-10">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Event Setup"
                    className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                  />

                  {/* Floating Cards */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="absolute -bottom-8 -right-8 bg-white/5 backdrop-blur-xl border border-red-500/30 rounded-xl p-4 bg-gradient-to-br from-red-500/20 to-orange-500/20"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-1">
                        50%
                      </div>
                      <div className="text-sm text-gray-300">Hemat Biaya</div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="absolute -top-8 -left-8 bg-white/5 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                        24/7
                      </div>
                      <div className="text-sm text-gray-300">Support</div>
                    </div>
                  </motion.div>
                </div>

                {/* Background Elements */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-full opacity-20 blur-3xl -z-10"></div>
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:pl-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-sm font-medium">
                  Solusi Terpercaya
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
              >
                Solusi Sewa{" "}
                <span className="bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  Proyektor, Screen, TV LED
                </span>
                , Flipchart, Speaker Portable, dan Megaphone yang Murah dan
                Mudah.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="text-lg text-gray-300 mb-8 leading-relaxed"
              >
                Kami menyediakan proyektor, screen, TV LED, flipchart, speaker
                portable dan megaphone. Sangat mudah dan praktis, cukup hubungi
                admin lalu informasikan kebutuhan multimedia untuk acaramu, kami
                siapkan peralatan terbaik dengan harga sewa terjangkau.
              </motion.p>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-4 mb-8"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://wa.me/6285712165658"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 rounded-full text-white font-semibold flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  <span>Konsultasi Sekarang</span>
                </motion.a>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-gray-600 px-8 py-4 rounded-full text-white font-semibold hover:bg-gray-600/10 hover:border-gray-500 transition-all duration-300"
                >
                  Lihat Portfolio
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
