
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS, WHATSAPP_NUMBER } from '../constants';
import { BlogPost as BlogPostType } from '../types';
import Button from '../components/Button';
import { ArrowLeft, Calendar, User, Share2, Clock, ChevronRight } from 'lucide-react';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);

  useEffect(() => {
    // Scroll to top when entering
    window.scrollTo(0, 0);

    const foundPost = BLOG_POSTS.find(p => p.slug === slug);
    if (foundPost) {
      setPost(foundPost);
    }
  }, [slug]);

  if (!post && !slug) return null; // Loading state essentially
  
  if (!post) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center text-center px-4">
         <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Artikel Tidak Ditemukan</h2>
         <p className="text-gray-500 mb-8">Maaf, artikel yang Anda cari tidak tersedia atau URL salah.</p>
         <Link to="/">
            <Button>Kembali ke Beranda</Button>
         </Link>
      </div>
    );
  }

  const handleShare = () => {
    const url = window.location.href;
    const text = `Baca artikel menarik ini dari Mpok Sari Catering: "${post.title}"\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const relatedPosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 3);

  return (
    <article className="min-h-screen bg-white dark:bg-black pt-24 pb-20">
      
      {/* Hero Header */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
         <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
         
         <div className="absolute bottom-0 left-0 w-full z-20 max-w-4xl mx-auto px-4 pb-12">
            <Link to="/#blog" className="inline-flex items-center text-white/80 hover:text-primary mb-6 transition-colors font-medium text-sm bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
               <ArrowLeft size={16} className="mr-2" /> Kembali ke Blog
            </Link>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight drop-shadow-lg">
               {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-200 text-sm md:text-base">
               <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  <span>{post.date}</span>
               </div>
               <div className="flex items-center gap-2">
                  <User size={18} className="text-primary" />
                  <span>{post.author || 'Admin Mpok Sari'}</span>
               </div>
               <div className="flex items-center gap-2">
                   <Clock size={18} className="text-primary" />
                   <span>5 menit baca</span>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-8 relative z-30">
         <div className="bg-white dark:bg-darkSurface rounded-3xl p-6 md:p-12 shadow-xl border border-gray-100 dark:border-gray-800">
            
            {/* Share Button Mobile */}
            <div className="flex justify-end mb-6 md:hidden">
                <button onClick={handleShare} className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-full">
                    <Share2 size={16} /> Share
                </button>
            </div>

            {/* Content Body */}
            <div 
               className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary hover:prose-a:text-orange-600 prose-img:rounded-2xl"
               dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Share & CTA Section */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                   <h4 className="font-bold text-gray-900 dark:text-white mb-2">Suka artikel ini?</h4>
                   <p className="text-sm text-gray-500 mb-4">Bagikan ke teman atau keluarga Anda.</p>
                   <button onClick={handleShare} className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-6 py-3 rounded-full font-bold transition-colors text-gray-800 dark:text-white">
                      <Share2 size={18} /> Bagikan Artikel
                   </button>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl text-center md:text-left max-w-sm">
                   <h4 className="font-bold text-primary mb-2">Butuh Catering Acara?</h4>
                   <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Konsultasikan kebutuhan menu Anda dengan tim kami sekarang.</p>
                   <Button size="sm" onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}>
                      Chat WhatsApp
                   </Button>
                </div>
            </div>

         </div>
      </div>

      {/* Related Posts */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-20">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 border-l-4 border-primary pl-4">Artikel Lainnya</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {relatedPosts.map(related => (
                <div key={related.id} onClick={() => navigate(`/blog/${related.slug}`)} className="group cursor-pointer bg-white dark:bg-darkSurface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-800">
                    <div className="h-48 overflow-hidden relative">
                        <img src={related.image} alt={related.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                            {related.date}
                        </div>
                    </div>
                    <div className="p-6">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">{related.title}</h4>
                        <div className="flex items-center text-primary text-sm font-bold">
                            Baca Selengkapnya <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
             ))}
          </div>
      </div>

    </article>
  );
};

export default BlogPost;
