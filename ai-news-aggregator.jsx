import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Zap, Sparkles, ExternalLink, Clock, Heart } from 'lucide-react';

export default function AINewsAggregator() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [liked, setLiked] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Симулированные новости
  const mockArticles = [
    {
      id: 1,
      title: 'OpenAI запустила нового помощника с улучшенной мультимодальностью',
      description: 'Компания представила новую версию своего AI-помощника с поддержкой видео, изображений и текста в реальном времени',
      source: 'TechCrunch',
      category: 'llm',
      timestamp: '2 часа назад',
      image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      link: '#'
    },
    {
      id: 2,
      title: 'Google DeepMind разработала новый алгоритм для квантовых вычислений',
      description: 'Исследователи представили прорывное решение для оптимизации работы квантовых систем',
      source: 'Nature Machine Intelligence',
      category: 'research',
      timestamp: '4 часа назад',
      image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      link: '#'
    },
    {
      id: 3,
      title: 'Anthropic выпустила Claude 4.5 с новыми возможностями анализа',
      description: 'Обновленная версия модели получила поддержку обработки больших объемов данных и улучшенное понимание контекста',
      source: 'Anthropic Blog',
      category: 'llm',
      timestamp: '6 часов назад',
      image: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      link: '#'
    },
    {
      id: 4,
      title: 'Meta представила новую архитектуру для эффективного обучения ИИ',
      description: 'Инженеры Meta разработали метод, сокращающий требования к вычислительным ресурсам на 60%',
      source: 'Meta Research',
      category: 'infrastructure',
      timestamp: '8 часов назад',
      image: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      link: '#'
    },
    {
      id: 5,
      title: 'Европейский Союз вводит новые стандарты безопасности для AI',
      description: 'Официальное принятие AI Act, регулирующего использование искусственного интеллекта в ЕС',
      source: 'EU Official Journal',
      category: 'policy',
      timestamp: '1 день назад',
      image: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      link: '#'
    },
    {
      id: 6,
      title: 'Миссия робота Tesla на Марсе начинается на базе AI',
      description: 'Компания использует новую AI-систему для навигации и принятия решений на Марсе',
      source: 'SpaceX News',
      category: 'applications',
      timestamp: '1 день назад',
      image: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      link: '#'
    }
  ];

  useEffect(() => {
    // Имитируем загрузку
    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 800);
  }, []);

  const categories = [
    { id: 'all', label: '📊 Все новости', icon: '📊' },
    { id: 'llm', label: '🧠 LLM', icon: '🧠' },
    { id: 'research', label: '🔬 Исследования', icon: '🔬' },
    { id: 'infrastructure', label: '⚙️ Инфраструктура', icon: '⚙️' },
    { id: 'policy', label: '⚖️ Политика', icon: '⚖️' },
    { id: 'applications', label: '🚀 Приложения', icon: '🚀' }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = category === 'all' || article.category === category;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (id) => {
    const newLiked = new Set(liked);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLiked(newLiked);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Фоновые элементы */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <div className="relative z-10">
        {/* Заголовок */}
        <div className="pt-8 px-4 md:px-8 pb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200">
              AI NEWS PULSE
            </h1>
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-purple-300 text-lg">Свежие новости из мира искусственного интеллекта</p>
        </div>

        {/* Поисковая строка */}
        <div className="px-4 md:px-8 mb-8">
          <div className="glass rounded-full px-6 py-4 flex items-center gap-3 max-w-2xl mx-auto">
            <Search className="w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Поиск новостей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white placeholder-purple-300"
            />
          </div>
        </div>

        {/* Категории */}
        <div className="px-4 md:px-8 mb-8">
          <div className="flex flex-wrap gap-3 justify-center max-w-6xl mx-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-full transition-all duration-300 font-medium ${
                  category === cat.id
                    ? 'glass bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                    : 'glass hover:bg-white/10 text-purple-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Новости */}
        <div className="px-4 md:px-8 pb-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="glass rounded-2xl p-6 h-64 animate-pulse">
                  <div className="h-32 bg-white/10 rounded-lg mb-4"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-6 text-center text-purple-300">
                <p className="text-sm flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {filteredArticles.length} актуальных новостей
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {filteredArticles.map((article, index) => (
                  <article
                    key={article.id}
                    className="glass rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-2"
                    style={{
                      animation: `slideUp 0.5s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <style>{`
                      @keyframes slideUp {
                        from {
                          opacity: 0;
                          transform: translateY(30px);
                        }
                        to {
                          opacity: 1;
                          transform: translateY(0);
                        }
                      }
                    `}</style>
                    
                    {/* Изображение */}
                    <div
                      className="h-40 w-full overflow-hidden relative"
                      style={{ background: article.image }}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => toggleLike(article.id)}
                          className={`p-2 rounded-full transition-all ${
                            liked.has(article.id)
                              ? 'bg-red-500 text-white'
                              : 'glass text-purple-300 hover:text-red-400'
                          }`}
                        >
                          <Heart className="w-5 h-5" fill={liked.has(article.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    {/* Контент */}
                    <div className="p-5">
                      <div className="flex items-start