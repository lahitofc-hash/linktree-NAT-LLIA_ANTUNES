// ============================================================
// COLE OS DOIS LINKS CSV DO GOOGLE SHEETS ABAIXO:
// ============================================================
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import * as Icons from "lucide-react";

// COLE SEUS LINKS CSV AQUI (Certifique-se de que são os links de PUBLICAÇÃO EM CSV)
const URL_LINKS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSg2WzGx7rXW7B0aVTVOmv4_0OJ_9T43Ovk_-Y61yOmUhyq_kl5NYDDKV6FtJkUpMknnbGYLbmKExF_/pub?gid=0&single=true&output=csv";
const URL_CONFIG = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSg2WzGx7rXW7B0aVTVOmv4_0OJ_9T43Ovk_-Y61yOmUhyq_kl5NYDDKV6FtJkUpMknnbGYLbmKExF_/pub?gid=1971191094&single=true&output=csv";

export default function LinktreeProfissional() {
  const [links, setLinks] = useState([]);
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resLinks, resConfig] = await Promise.all([
          fetch(URL_LINKS),
          fetch(URL_CONFIG)
        ]);

        const textLinks = await resLinks.text();
        const textConfig = await resConfig.text();

        const dataLinks = Papa.parse(textLinks, { header: true, skipEmptyLines: true }).data;
        // Encontre esta parte e ajuste para:
        const dataConfig = Papa.parse(textConfig, { header: true, skipEmptyLines: true }).data;

        if (dataConfig && dataConfig.length > 0) {
        // O "[0]" é o que faz o nome da Natállia aparecer, 
        // pois pega a primeira linha da planilha.
        setConfig(dataConfig[0]); 
}

        }
      } catch (error) {
        console.error("Erro ao carregar dados da planilha:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const themeColor = config.color || "#a855f7";

  return (
    <div className="min-h-screen relative text-white flex flex-col items-center px-6 py-16 font-sans overflow-x-hidden">
      
      {/* BACKGROUND DINÂMICO */}
      <div 
        className="fixed inset-0 -z-10"
        style={{ 
          backgroundColor: "#0a0a0a",
          backgroundImage: config.bg_image ? `linear-gradient(to bottom, rgba(10,10,10,0.8), #0a0a0a), url(${config.bg_image})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-12 text-center">
        <div 
          className="w-28 h-28 rounded-full border-2 p-1.5 mb-6 shadow-2xl overflow-hidden"
          style={{ borderColor: `${themeColor}80`, boxShadow: `0 0 30px ${themeColor}33` }}
        >
          <img 
            src={config.avatar || "https://picsum.photos"} 
            alt="Avatar" 
            className="object-cover w-full h-full rounded-full bg-zinc-800" 
          />
        </div>
        <h1 className="text-2xl font-bold tracking-tighter uppercase mb-1 drop-shadow-md">
          {config.nome_artista || "CARREGANDO..."}
        </h1>
        <p className="text-zinc-400 text-[10px] tracking-[0.3em] uppercase font-medium">
          {config.bio || ""}
        </p>
      </motion.div>

      {/* LINKS */}
      <div className="w-full max-w-[400px] space-y-4 z-10">
        <AnimatePresence mode="wait">
          {!loading && links.map((link, index) => {
            // Ajuste automático do nome do ícone (ex: instagram -> Instagram)
            const iconName = link.icon 
              ? link.icon.charAt(0).toUpperCase() + link.icon.slice(1).toLowerCase() 
              : "ExternalLink";
            
            const IconComponent = Icons[iconName] || Icons.ExternalLink;
            const isHighlighted = String(link.highlight).toLowerCase() === "true";

            return (
              <motion.a
                key={index}
                href={link.url?.startsWith("http") ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group flex items-center p-4 rounded-2xl border transition-all duration-300
                  ${isHighlighted ? "bg-white text-black border-white shadow-xl" : "bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/60"}
                `}
                style={{ 
                  touchAction: "manipulation",
                  ...(!isHighlighted ? { borderLeft: `4px solid ${themeColor}` } : {}) 
                }}
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
      
      {/* RODAPÉ */}
      <footer className="mt-auto pt-20 pb-8 flex flex-col items-center">
        <a 
          href="www.instagram.com/le_aohit/" 
          target="_blank" 
          className="text-[9px] text-zinc-600 tracking-[0.4em] uppercase font-bold hover:text-white transition-colors"
        >
          Powered by @la_aohit
        </a>
      </footer>
    </div>
  );
}
