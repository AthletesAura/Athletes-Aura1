import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StorageService } from '../services/storage.ts';
import { LegalPage } from '../types.ts';

export const LegalViewer: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [page, setPage] = useState<LegalPage | null>(null);

    useEffect(() => {
        const loadPage = async () => {
            if (slug) {
                const pages = await StorageService.getLegalPages();
                const found = pages.find(p => p.slug === slug);
                setPage(found || null);
            }
        };
        loadPage();
    }, [slug]);

    if (!page) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
                    <p className="text-gray-600">The legal document you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white pb-20">
            <div className="bg-black py-20 mb-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase mb-4">{page.title}</h1>
                    <p className="text-gray-400">Last Updated: {new Date(page.lastUpdated).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
        </div>
    );
};
