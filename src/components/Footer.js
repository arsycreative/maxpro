"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const services = [
    "Sewa Proyektor",
    "Sewa TV LED",
    "Sewa Screen",
    "Sewa Speaker",
    "Sewa Sound System",
    "Paket Seminar",
  ];

  const serviceAreas = [
    "Yogyakarta",
    "Bantul",
    "Sleman",
    "Gunung Kidul",
    "Kulonprogo",
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Kontak", href: "/contact" },
  ];

  return (
    <footer className="relative bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 pt-20 pb-12">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              {/* Logo */}
              <div className="mb-6">
                <Image
                  src="/logo.webp"
                  alt="Logo MAXPRO"
                  width={180}
                  height={72}
                  className="h-auto object-contain"
                />
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Solusi terpercaya untuk kebutuhan multimedia event Anda. Sejak
                2020, kami melayani dengan profesional dan berkualitas.
              </p>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-6 relative">
                <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  Layanan Kami
                </span>
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-red-500 to-pink-500"></div>
              </h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 4 }}
                    className="group"
                  >
                    <a
                      href="#"
                      className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center space-x-2"
                    >
                      <div className="w-1 h-1 bg-red-500 rounded-full group-hover:w-2 transition-all duration-300"></div>
                      <span>{service}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Service Areas & Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-6 relative">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Area Layanan
                </span>
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </h3>
              <ul className="space-y-3 mb-8">
                {serviceAreas.map((area, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 4 }}
                    className="group"
                  >
                    <div className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center space-x-2">
                      <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      <span>{area}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-6 relative">
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Kontak Kami
                </span>
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              </h3>

              <div className="space-y-4">
                <motion.a
                  whileHover={{ scale: 1.02, x: 4 }}
                  href="https://wa.me/6285712165658"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm border border-green-500/20 rounded-xl hover:bg-green-500/10 hover:border-green-500/40 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">WhatsApp</p>
                    <p className="text-green-400 text-sm">+62 857-1216-5658</p>
                  </div>
                </motion.a>

                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-xl hover:bg-blue-500/10 hover:border-blue-500/40 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-blue-400 text-sm">
                      maxproyogya@gmail.com
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm border border-orange-500/20 rounded-xl hover:bg-orange-500/10 hover:border-orange-500/40 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Jam Operasional</p>
                    <p className="text-orange-400 text-sm">24/7 Available</p>
                  </div>
                </motion.div>
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-6"
              >
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://wa.me/6285712165658"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-3 rounded-xl text-white font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  <span>Konsultasi Gratis</span>
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 bg-black/50 backdrop-blur-sm"
        >
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm text-center md:text-left">
                <p>
                  © 2024{" "}
                  <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                    MAXPRO
                  </span>
                  . All rights reserved. | Rental Multimedia Terpercaya Sejak
                  2020
                </p>
              </div>

              <div className="flex items-center space-x-6 text-gray-400 text-sm">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Online 24/7</span>
                </motion.div>

                <div className="flex items-center space-x-4">
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Privacy Policy
                  </a>
                  <span>•</span>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating WhatsApp Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        viewport={{ once: true }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href="https://wa.me/6285712165658"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <ChatBubbleLeftRightIcon className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute -inset-2 rounded-full bg-green-500/30 animate-pulse opacity-75"></div>
        </motion.a>
      </motion.div>
    </footer>
  );
}
