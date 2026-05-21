import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, ExternalLink } from 'lucide-react';

export default function KnowledgeBase() {
    const faqs = [
        { question: 'How do I reset my Windows password?', answer: 'Go to the login screen, click on "Reset password" and follow the prompts. You will need your security key or a text message sent to your registered mobile number.' },
        { question: 'How do I connect to the corporate VPN?', answer: 'Open Cisco AnyConnect, enter vpn.company.com and use your Active Directory credentials to log in.' },
        { question: 'What is the standard SLA for HR requests?', answer: 'Most HR requests have a standard 48-hour SLA, except for urgent issues like payroll discrepancies which are handled within 12 hours.' },
    ];

    const [openFaq, setOpenFaq] = useState(0);

    return (
        <div className="fade-in max-w-4xl mx-auto" style={{ maxWidth: '64rem', margin: '0 auto' }}>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">Knowledge Base</h1>
                <p className="text-muted mb-6">Find answers to common questions and self-service guides.</p>
                <div className="flex justify-center">
                    <div className="flex items-center bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)] overflow-hidden shadow-sm" style={{ maxWidth: '32rem', margin: '0 auto', display: 'flex', padding: '0.5rem', width: '100%' }}>
                        <Search size={20} className="text-muted mr-2" style={{ marginRight: '0.5rem' }} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full border-none bg-transparent outline-none text-[var(--text-main)]"
                            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)' }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="card">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen className="text-primary" style={{ color: 'var(--primary)' }} /> FAQs</h2>
                    <div className="accordion">
                        {faqs.map((faq, index) => (
                            <div key={index} className={`accordion-item ${openFaq === index ? 'open' : ''}`}>
                                <div className="accordion-header" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                                    {faq.question}
                                    {openFaq === index ? <ChevronUp size={20} className="text-muted" /> : <ChevronDown size={20} className="text-muted" />}
                                </div>
                                <div className="accordion-content text-sm text-muted">
                                    {faq.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4 pl-1">Categories</h2>
                    <div className="grid gap-4" style={{ display: 'grid', gap: '1rem' }}>
                        {['IT Setup & Hardware', 'Software & Licensing', 'Security & Access', 'HR & Policies'].map(c => (
                            <div key={c} className="card p-4 flex justify-between items-center cursor-pointer transition" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                                <span className="font-medium text-sm">{c}</span>
                                <span className="text-xs badge badge-primary">12 articles</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 card border-blue-200" style={{ marginTop: '1.5rem', backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
                        <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 className="font-bold" style={{ color: '#1e3a8a' }}>Confluence Integration</h3>
                                <p className="text-sm mt-1" style={{ color: '#2563eb' }}>Search the full corporate wiki</p>
                            </div>
                            <button className="btn btn-primary flex items-center gap-2" style={{ backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Go to Wiki <ExternalLink size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
