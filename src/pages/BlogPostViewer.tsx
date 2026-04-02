
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Instagram } from 'lucide-react';
import { StorageService } from '../services/storage.ts';
import { BlogPost } from '../types.ts';
import { generateSlug } from '../lib/utils';

export const BlogPostViewer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (slug) {
        const blogs = await StorageService.getBlogs();
        // Try to find by saved slug, generated slug, or ID
        const blog = blogs.find(b => b.slug === slug || generateSlug(b.title) === slug || b.id === slug);
        if (blog) {
          setPost(blog);
        } else {
          navigate('/blog');
        }
      }
      setLoading(false);
    };
    loadPost();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">Loading...</div>;
  }

  if (!post) return null;

  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={16} /> {new Date(post.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <User size={16} /> {post.author}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-16"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="border-t border-gray-100 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <User size={32} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Written by</p>
                <p className="font-bold text-lg text-gray-900">{post.author}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Share</span>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <Facebook size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <Twitter size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <Instagram size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Posts teaser could go here */}
      </div>
    </div>
  );
};
