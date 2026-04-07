
// ============================================================
// 1. COLE SEU LINK DO GOOGLE SHEETS (PUBLICAÇÃO EM CSV) AQUI:
// ============================================================
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSg2WzGx7rXW7B0aVTVOmv4_0OJ_9T43Ovk_-Y61yOmUhyq_kl5NYDDKV6FtJkUpMknnbGYLbmKExF_/pub?output=csv";

interface LinkItem {
  label: string;
  url: string;
  icon: string;
  highlight: string;
  color?: string;
  bio?: string;
  avatar?: string;
}

export default function LinktreeMaster() {
  const [data, setData] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Configurações extraídas da primeira linha válida da planilha
  const config = {
    color: data[0]?.color || "#a855f7",
    bio: data[0]?.bio || "Cantora & Compositora",
    avatar: data[0]?.avatar || "https://picsum.photos",
  };

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
        // Filtra apenas linhas que tenham pelo menos um label
        const validData = (results.data as LinkItem[]).filter(item => item.label);
        setData(validData);
        setLoading(false);
      },
      error: () => setLoading(false)
    });
  }, []);

  // Função para garantir que o link sempre tenha http ou https
  const formatUrl = (url: string) => {
    return url.startsWith("http") ? url : `https://${url}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col items-center px-6 py-16 font-sans selection:bg-purple-500/30">
      
      {/* HEADER DINÂMICO */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col items-center mb-12 text-center"
      >
        <div 
          className="w-28 h-28 rounded-full border-2 p-1.5 mb-6 shadow-2xl transition-all duration-1000"
          style={{ 
            borderColor: `${config.color}80`, 
            boxShadow: `0 0 30px ${config.color}33` 
          }}
        >
          <div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden border border-white/5">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
               src={config.avatar} 
               alt="Artista" 
               className="object-cover w-full h-full hover:scale-110 transition-transform duration-500" 
             />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tighter uppercase mb-1">NOME DA ARTISTA</h1>
        <p className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase font-medium">{config.bio}</p>
      </motion.div>

      {/* LISTA DE LINKS */}
      <div className="w-full max-w-[400px] space-y-4">
        <AnimatePresence mode="wait">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[72px] w-full bg-zinc-900/40 border border-white/5 rounded-2xl animate-pulse" />
            ))
          ) : data.length > 0 ? (
            data.map((link, index) => {
              // @ts-ignore - Busca dinâmica de ícone no Lucide
              const IconComponent = Icons[link.icon] || Icons.ExternalLink;
              const isHighlighted = String(link.highlight).toLowerCase() === "true";

              return (
                <motion.a
                  key={index}
                  href={formatUrl(link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    group flex items-center p-4 rounded-2xl border transition-all duration-300
                    ${isHighlighted 
                      ? "bg-white text-black border-white shadow-[0_10px_40px_rgba(255,255,255,0.15)]" 
                      : "bg-zinc-900/40 border-white/5 hover:border-white/20 hover:bg-zinc-900/80"}
                  `}
                  style={!isHighlighted ? { borderLeftColor: config.color, borderLeftWidth: '4px' } : {}}
                >
                  <div 
                    className="mr-4 transition-transform group-hover:rotate-12" 
                    style={{ color: isHighlighted ? "black" : config.color }}
                  >
                    <IconComponent size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-[16px] font-bold tracking-tight">{link.label}</span>
                  </div>
                  <Icons.ArrowUpRight size={18} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                </motion.a>
              );
            })
          ) : (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
              <p className="text-zinc-600 text-sm">Verifique o link da planilha...</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <footer className="mt-auto pt-20 flex flex-col items-center gap-2">
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-4" />
        <p className="text-[9px] text-zinc-600 tracking-[0.4em] uppercase font-bold">L'A HIT PRODUÇÕES</p>
      </footer>
    </div>
  );
}
