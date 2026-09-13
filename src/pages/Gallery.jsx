import { useEffect, useState } from 'react';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUrl';

const getYouTubeId = (url) => {
  if (!url) return null;

  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );

  return match ? match[1] : null;
};

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [mediaFilter, setMediaFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightboxItem, setLightboxItem] = useState(null);

  const categories = [
    'All',
    'Workshops',
    'Competitions',
    'Project Demonstrations',
    'Club Activities'
  ];

  useEffect(() => {
    axios
      .get('/api/gallery')
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filteredItems = items.filter((item) => {
    const isVideo =
      item.mediaType === 'video' || !!item.videoUrl;

    if (mediaFilter === 'image' && isVideo) return false;
    if (mediaFilter === 'video' && !isVideo) return false;

    if (activeCategory === 'All') return true;

    return item.category === activeCategory;
  });

  return (
    <div className='max-w-7xl mx-auto px-6 py-14'>

      {/* Header */}
      <div className='text-center max-w-3xl mx-auto mb-10'>

        <span className='font-tech text-xs font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/30 shadow-sm'>
          Visual & Motion Archives
        </span>

        <h1 className='font-display text-4xl sm:text-6xl font-black mt-3 text-white'>
          SMC Club Gallery
        </h1>

        <p className='mt-3 text-slate-300 text-sm sm:text-base leading-relaxed'>
          A vibrant collection of our intensive workshops, hackathon victories,
          autonomous rover trials, hardware demos, and lab building sprints.
        </p>

      </div>

      {/* Media Type & Category Filters */}
      <div className='flex flex-col items-center gap-4 mb-12'>

        {/* Media Type Toggle */}
        <div className='inline-flex p-1 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur shadow-lg'>

          <button
            onClick={() => setMediaFilter('All')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mediaFilter === 'All'
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Media ({items.length})
          </button>

          <button
            onClick={() => setMediaFilter('image')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mediaFilter === 'image'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📷 Photos (
              {
                items.filter(
                  (i) => i.mediaType !== 'video' && !i.videoUrl
                ).length
              }
              )
          </button>

          <button
            onClick={() => setMediaFilter('video')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mediaFilter === 'video'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎥 Videos (
              {
                items.filter(
                  (i) => i.mediaType === 'video' || !!i.videoUrl
                ).length
              }
              )
          </button>

        </div>

        {/* Category Tabs */}
        <div className='flex flex-wrap items-center justify-center gap-2'>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'btn-primary-gradient shadow-lg scale-105'
                  : 'glass text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}

        </div>

      </div>

      {/* Gallery Grid */}
      {loading ? (

        <div className='text-center py-20 text-cyan-400 font-tech text-xs'>
          <span className='inline-block w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2' />
          Loading gallery archives...
        </div>

      ) : filteredItems.length === 0 ? (

        <div className='text-center py-16 glass rounded-3xl p-8 border border-white/10 max-w-md mx-auto'>
          <p className='text-lg font-bold text-white font-display'>
            No media found in this category.
          </p>

          <p className='text-xs text-slate-400 mt-1'>
            Check back soon for upcoming lab photos and demo videos!
          </p>
        </div>

      ) : (

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>

          {filteredItems.map((item) => {

            const isVideo =
              item.mediaType === 'video' || !!item.videoUrl;

            const ytId =
              isVideo && item.videoUrl
                ? getYouTubeId(item.videoUrl)
                : null;

            /*
             * IMPORTANT:
             * MongoDB me image `/uploads/filename.jpg`
             * stored hai.
             *
             * getImageUrl() ise:
             * https://smcclub-1.onrender.com/uploads/filename.jpg
             * me convert karega.
             */
            const displayThumbnail = item.image
              ? getImageUrl(item.image)
              : ytId
              ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
              : '';

            return (

              <div
                key={item._id}
                onClick={() => setLightboxItem(item)}
                className='group relative rounded-3xl overflow-hidden glass-card aspect-[4/3] bg-slate-950 cursor-pointer border border-white/10 hover:border-cyan-400/50 hover:shadow-[0_12px_35px_-8px_rgba(0,240,255,0.25)] transition-all duration-300'
              >

                {/* Media representation */}
                {displayThumbnail ? (

                  <img
                    src={displayThumbnail}
                    alt={item.title || 'SMC Club'}
                    className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-500'
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />

                ) : isVideo && item.videoUrl ? (

                  <video
                    src={getImageUrl(item.videoUrl)}
                    preload='metadata'
                    muted
                    className='h-full w-full object-cover'
                  />

                ) : (

                  <div className='h-full w-full flex items-center justify-center bg-slate-900 text-slate-500 font-tech text-xs'>
                    Media Preview
                  </div>

                )}

                {/* Video Play Overlay */}
                {isVideo && (

                  <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>

                    <div className='w-14 h-14 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-400/60 text-cyan-300 flex items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.4)] group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300'>

                      <span className='text-lg font-bold pl-1'>
                        ▶
                      </span>

                    </div>

                  </div>

                )}

                {/* Gradient and Info Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity flex flex-col justify-between p-6'>

                  <div className='flex justify-between items-start'>

                    <div className='flex flex-wrap items-center gap-1.5'>

                      <span className='font-tech text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-slate-950/70 backdrop-blur px-3 py-1 rounded-full border border-cyan-500/30'>
                        {item.category || 'Lab Activity'}
                      </span>

                      <span className='font-tech text-[9px] text-slate-300 bg-slate-950/70 backdrop-blur px-2 py-0.5 rounded-full border border-white/10'>
                        📅{' '}
                        {item.date
                          ? new Date(item.date).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              }
                            )
                          : new Date(
                              item.createdAt || Date.now()
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                      </span>

                    </div>

                    {isVideo && (

                      <span className='font-tech text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 px-2.5 py-1 rounded-full shadow-md flex items-center gap-1'>

                        <span>🎥</span>
                        <span>Video</span>

                      </span>

                    )}

                  </div>

                  <div>

                    <p className='font-display font-bold text-lg text-white group-hover:text-cyan-300 transition-colors'>
                      {item.title}
                    </p>

                    <span className='text-[11px] font-tech text-cyan-300 mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-bold'>

                      <span>
                        {isVideo
                          ? 'Click to watch video'
                          : 'Click to expand photo'}
                      </span>

                      <span>↗</span>

                    </span>

                  </div>

                </div>

              </div>

            );
          })}

        </div>

      )}

      {/* Lightbox / Video Player Modal */}
      {lightboxItem && (

        <div
          onClick={() => setLightboxItem(null)}
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fadeIn'
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className='relative max-w-4xl w-full glass-card rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 p-4 sm:p-6'
          >

            <button
              onClick={() => setLightboxItem(null)}
              className='absolute top-4 right-4 w-9 h-9 rounded-full glass flex items-center justify-center text-slate-300 hover:text-white z-20'
            >
              ✕
            </button>

            {/* Content Display */}
            {(() => {

              const isVideo =
                lightboxItem.mediaType === 'video' ||
                !!lightboxItem.videoUrl;

              const ytId =
                isVideo && lightboxItem.videoUrl
                  ? getYouTubeId(lightboxItem.videoUrl)
                  : null;

              if (isVideo) {

                if (ytId) {

                  return (

                    <div className='relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl'>

                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                        title={lightboxItem.title}
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                        allowFullScreen
                        className='w-full h-full border-0'
                      />

                    </div>

                  );
                }

                return (

                  <div className='max-h-[70vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-2xl'>

                    <video
                      src={getImageUrl(lightboxItem.videoUrl)}
                      controls
                      autoPlay
                      playsInline
                      className='w-full max-h-[70vh] object-contain'
                    />

                  </div>

                );
              }

              return (

                <div className='max-h-[70vh] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center shadow-2xl'>

                  <img
                    src={getImageUrl(lightboxItem.image)}
                    alt={lightboxItem.title}
                    className='w-full h-full object-contain max-h-[70vh]'
                  />

                </div>

              );

            })()}

            <div className='pt-4 flex items-center justify-between'>

              <div>

                <div className='flex items-center gap-2'>

                  <span className='font-tech text-xs text-cyan-400 font-bold uppercase'>
                    {lightboxItem.category}
                  </span>

                  {(lightboxItem.mediaType === 'video' ||
                    lightboxItem.videoUrl) && (

                    <span className='text-[10px] font-tech font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'>
                      🎥 Video Player
                    </span>

                  )}

                </div>

                <h3 className='font-display font-bold text-2xl text-white mt-1'>
                  {lightboxItem.title}
                </h3>

              </div>

              <span className='font-tech text-xs text-slate-300 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10'>

                <span>📅</span>

                <span>
                  {lightboxItem.date
                    ? new Date(
                        lightboxItem.date
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : new Date(
                        lightboxItem.createdAt || Date.now()
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                </span>

              </span>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
