"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import * as Icons from "lucide-react";

// ============================================================
// COLE SEU LINK DO GOOGLE SHEETS (PUBLICAÇÃO EM CSV) AQUI:
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSg2WzGx7rXW7B0aVTVOmv4_0OJ_9T43Ovk_-Y61yOmUhyq_kl5NYDDKV6FtJkUpMknnbGYLbmKExF_/pub?output=csv";
// ============================================================

export default function LinktreeDefinitivo() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!SHEET_URL || SHEET_URL.includes("SEU_LINK_AQUI")) {
      setLoading(false);
      return;
    }
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        setLoading(false);
      },
      error: () => setLoading(false)
    });
  }, []);

  // Pega configurações da PRIMEIRA LINHA de dados da planilha
  const settings = data[0] || {};
  const themeColor = settings.color || "#a855f7";
  const artistName = settings.nome_artista || "NOME NA PLANILHA";
  const artistBio = settings.bio || "BIO NA PLANILHA";
  const artistPhoto = settings.avatar || "https://picsum.photos";
  const background = settings.bg_image || "";

  return (
    <div className="min-h-screen relative text-white flex flex-col items-center px-6 py-16 font-sans">
      
      {/* FUNDO */}
      <div 
        className="fixed inset-0 -z-10 bg-[#0a0a0a]"
        style={{ 
          backgroundImage: background ? `linear-gradient(to bottom, rgba(10,10,10,0.8), #0a0a0a), url(${background})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      {/* HEADER DINÂMICO */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-12 text-center">
        <div 
          className="w-28 h-28 rounded-full border-2 p-1.5 mb-6 shadow-2xl transition-all duration-1000"
          style={{ borderColor: `${themeColor}80`, boxShadow: `0 0 30px ${themeColor}33` }}
        >
          <div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden border border-white/5">
             <img src={artistPhoto} alt="Foto" className="object-cover w-full h-full" />
          </div>
        </div>
        <h1 className="text-2xl font-bold uppercase tracking-tighter">{artistName}</h1>
        <p className="text-zinc-400 text-[10px] tracking-[0.3em] uppercase mt-1">{artistBio}</p>
      </motion.div>

      {/* LINKS */}
      <div className="w-full max-w-[400px] space-y-4 z-10">
        <AnimatePresence>
          {!loading && data.map((link, index) => {
            if (!link.label) return null;
            // @ts-ignore
            const IconComponent = Icons[link.icon] || Icons.ExternalLink;
            const isHighlighted = String(link.highlight).toLowerCase() === "true";

            return (
              <motion.a
                key={index}
                href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className={`group flex items-center p-4 rounded-2xl border transition-all duration-300
                  ${isHighlighted ? "bg-white text-black border-white" : "bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/60"}
                `}
                style={!isHighlighted ? { borderLeftColor: themeColor, borderLeftWidth: '4px' } : {}}
              >
                <div className="mr-4" style={{ color: isHighlighted ? "black" : themeColor }}>
                  <IconComponent size={24} />
                </div>
                <span className="text-[16px] font-bold flex-1 tracking-tight">{link.label}</span>
                <Icons.ArrowUpRight size={18} className="opacity-20" />
              </motion.a>
            );
          })}
        </AnimatePresence>
      </div>

      {/* SEU RODAPÉ PERSONALIZADO */}
      <footer className="mt-auto pt-20 pb-8 flex flex-col items-center">
        <a 
          href="https://www.instagram.com/le_aohit/" 
          target="_blank" 
          className="text-[9px] text-zinc-600 tracking-[0.4em] uppercase font-bold hover:text-white transition-colors"
        >
          Powered by @la_aohit
        </a>
      </footer>
    </div>
  );
}
