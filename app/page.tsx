"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import * as Icons from "lucide-react";

// COLE SEU LINK CSV AQUI (depois de organizar a planilha)
const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSg2WzGx7rXW7B0aVTVOmv4_0OJ_9T43Ovk_-Y61yOmUhyq_kl5NYDDKV6FtJkUpMknnbGYLbmKExF_/pub?output=csv"
export default function LinktreeProfissional() {
  const [links, setLinks] = useState([]);
  const [config, setConfig] = useState({
    nome_artista: "Nattália Antunes",
    bio: "CANTORA & COMPOSITORA",
    color: "#a855f7",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    bg_image: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL_CSV);
        const text = await response.text();
        const data = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
        
        console.log("Dados carregados:", data);
        
        if (data && data.length > 0) {
          // Primeira linha tem a configuração da artista
          const primeiraLinha = data[0];
          
          // Só atualiza se tiver valores válidos
          if (primeiraLinha.nome_artista) {
            setConfig({
              nome_artista: primeiraLinha.nome_artista,
              bio: primeiraLinha.bio || "CANTORA & COMPOSITORA",
              color: primeiraLinha.color || "#a855f7",
              avatar: primeiraLinha.avatar || "https://randomuser.me/api/portraits/women/68.jpg",
              bg_image: primeiraLinha.bg_image || ""
            });
          }
          
          // Filtra os links (linhas que têm label e url preenchidos)
          const linksList = data
            .filter(row => row.label && row.label.trim() !== "" && row.url && row.url.trim() !== "")
            .map(row => ({
              label: row.label,
              url: row.url,
              icon: row.icon || "ExternalLink",
              highlight: row.highlight === "TRUE" || row.highlight === "true"
            }));
          
          setLinks(linksList);
          console.log("Links processados:", linksList);
        }
        
      } catch (error) {
        console.error("Erro ao carregar:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const themeColor = config.color || "#a855f7";

  return (
    <div className="min-h-screen relative text-white flex flex-col items-center px-6 py-16 font-sans overflow-x-hidden">
      
      <div 
        className="fixed inset-0 -z-10"
        style={{ 
          backgroundColor: "#0a0a0a",
          backgroundImage: config.bg_image ? `linear-gradient(to bottom, rgba(10,10,10,0.8), #0a0a0a), url(${config.bg_image})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-12 text-center">
        <div 
          className="w-28 h-28 rounded-full border-2 p-1.5 mb-6 shadow-2xl overflow-hidden"
          style={{ borderColor: `${themeColor}80`, boxShadow: `0 0 30px ${themeColor}33` }}
        >
          <img 
            src={config.avatar} 
            alt="Avatar" 
            className="w-full h-full rounded-full object-cover bg-zinc-800"
            onError={(e) => { e.target.src = "https://randomuser.me/api/portraits/women/68.jpg"; }}
          />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tighter uppercase mb-1 drop-shadow-md">
          {config.nome_artista}
        </h1>

        <p className="text-zinc-400 text-[10px] tracking-[0.3em] uppercase font-medium">
          {config.bio}
        </p>
      </motion.div>

      <div className="w-full max-w-[400px] space-y-4 z-10">
        <AnimatePresence mode="wait">
          {!loading && links.map((link, index) => {
            const iconName = link.icon 
              ? link.icon.charAt(0).toUpperCase() + link.icon.slice(1).toLowerCase() 
              : "ExternalLink";
            
            const IconComponent = Icons[iconName] || Icons.ExternalLink;

            return (
              <motion.a
                key={index}
                href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group flex items-center p-4 rounded-2xl border transition-all duration-300
                  ${link.highlight ? "bg-white text-black border-white shadow-xl" : "bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/60"}
                `}
                style={{ 
                  touchAction: "manipulation",
                  ...(!link.highlight ? { borderLeft: `4px solid ${themeColor}` } : {}) 
                }}
              >
                <div className="mr-4" style={{ color: link.highlight ? "black" : themeColor }}>
                  <IconComponent size={24} />
                </div>
                <span className="text-[16px] font-bold flex-1 tracking-tight">{link.label}</span>
                <Icons.ArrowUpRight size={18} className="opacity-20" />
              </motion.a>
            );
          })}
        </AnimatePresence>
      </div>
      
      <footer className="mt-auto pt-20 pb-8 flex flex-col items-center">
        <a 
          href="https://www.instagram.com/le_aohit/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[9px] text-zinc-600 tracking-[0.4em] uppercase font-bold hover:text-white transition-colors"
        >
          POWERED BY L'A HIT
        </a>
      </footer>
    </div>
  );
}
