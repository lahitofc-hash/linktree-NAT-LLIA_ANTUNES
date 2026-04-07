"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import * as Icons from "lucide-react";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSg2WzGx7rXW7B0aVTVOmv4_0OJ_9T43Ovk_-Y61yOmUhyq_kl5NYDDKV6FtJkUpMknnbGYLbmKExF_/pub?output=csv";

interface LinkItem {
  label: string;
  url: string;
  icon: string;
  highlight: string;
  color?: string;  // Nova coluna
  bio?: string;    // Nova coluna
  avatar?: string; // Nova coluna
}

export default function LinktreeArtista() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Configurações padrão caso a planilha falhe
  const config = {
    color: links[0]?.color || "#a855f7",
    bio: links[0]?.bio || "Cantora & Compositora",
    avatar: links[0]?.avatar || "https://picsum.photos"
  };

  useEffect(() => {
    const fetchData = () => {
      Papa.parse(SHEET_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setLinks(results.data as LinkItem[]);
          setLoading(false);
        },
        error: () => setLoading(false)
      });
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col items-center px-6 py-16">
      
      {/* HEADER DINÂMICO */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center mb-12 text-center">
        <div 
          className="w-24 h-24 rounded-full border-2 p-1.5 mb-4 shadow-lg"
          style={{ borderColor: `${config.color}80`, boxShadow: `0 0 20px ${config.color}33` }}
        >
          <div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden">
             <img src={config.avatar} alt="Artista" className="object-cover w-full h-full" />
          </div>
        </div>
        <h1 className="text-xl font-bold tracking-tighter uppercase">NOME DA ARTISTA</h1>
        <p className="text-zinc-500 text-xs mt-1 tracking-widest uppercase">{config.bio}</p>
      </motion.div>

      {/* LISTA DE LINKS */}
      <div className="w-full max-w-[400px] space-y-4">
        <AnimatePresence mode="wait">
          {loading ? (
            [1, 2, 3].map((i) => <div key={i} className="h-[68px] bg-zinc-900/50 rounded-2xl animate-pulse" />)
          ) : (
            links.map((link, index) => {
              // @ts-ignore
              const IconComponent = Icons[link.icon] || Icons.ExternalLink;
              const isHighlighted = String(link.highlight).toLowerCase() === "true";

              return (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  whileHover={{ scale: 1.02 }}
                  className={`group flex items-center p-4 rounded-2xl border transition-all
                    ${isHighlighted ? "bg-white text-black border-white" : "bg-zinc-900/40 border-white/10"}
                  `}
                  style={!isHighlighted ? { borderLeftColor: config.color, borderLeftWidth: '3px' } : {}}
                >
                  <div className="mr-4" style={{ color: isHighlighted ? "black" : config.color }}>
                    <IconComponent size={22} />
                  </div>
                  <span className="text-[15px] font-semibold flex-1">{link.label}</span>
                  <Icons.ChevronRight size={16} className="opacity-30" />
                </motion.a>
              );
            })
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-auto pt-16 opacity-30 text-[10px] tracking-[0.3em]">POWERED BY L'A HIT</footer>
    </div>
  );
}
