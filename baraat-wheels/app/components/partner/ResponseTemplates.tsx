'use client';

import { useState } from 'react';
import { Copy, CheckCircle, Edit, Star, MessageSquare, ThumbsUp } from 'lucide-react';

const responseTemplates = [
  {
    id: 1,
    name: '5-Star Appreciation',
    content: 'Thank you so much for the wonderful review! We\'re thrilled to hear that you enjoyed our service. Looking forward to serving you again soon!',
    useCase: '5-star reviews',
    usage: 42,
  },
  {
    id: 2,
    name: '4-Star Thank You',
    content: 'Thank you for your feedback and the 4-star rating! We\'re glad you had a good experience and appreciate your suggestions for improvement.',
    useCase: '4-star reviews',
    usage: 28,
  },
  {
    id: 3,
    name: 'Issue Resolution',
    content: 'Thank you for bringing this to our attention. We sincerely apologize for the inconvenience and have taken immediate action to address this. Please contact us directly so we can make it right.',
    useCase: 'Negative feedback',
    usage: 15,
  },
  {
    id: 4,
    name: 'Professional Response',
    content: 'We appreciate you taking the time to share your experience. Your feedback is valuable as we continuously strive to improve our services.',
    useCase: 'Corporate clients',
    usage: 35,
  },
  {
    id: 5,
    name: 'Repeat Customer',
    content: 'Thank you for being a valued repeat customer! We\'re honored by your continued trust and look forward to many more bookings with you.',
    useCase: 'Loyal customers',
    usage: 24,
  },
];

export default function ResponseTemplates() {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleCopy = async (id: number, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEdit = (id: number, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const saveEdit = (id: number) => {
    // In a real app, save to backend
    console.log(`Saved template ${id}:`, editContent);
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
          <MessageSquare className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Response Templates</h2>
          <p className="text-gray-600">Quick responses for common review types</p>
        </div>
      </div>

      <div className="space-y-4">
        {responseTemplates.map((template) => (
          <div key={template.id} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-800">{template.name}</h4>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {template.useCase}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{template.usage} uses</span>
              </div>
            </div>

            {editingId === template.id ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(template.id)}
                    className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-700 mb-3">{template.content}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(template.id, template.content)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100"
                  >
                    {copiedId === template.id ? (
                      <>
                        <CheckCircle size={14} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(template.id, template.content)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 ml-auto">
                    <ThumbsUp size={14} />
                    Use
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add New Template */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors">
          + Add New Template
        </button>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
        <h4 className="font-bold text-gray-800 mb-2">💡 Best Practices</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Always personalize templates with customer names</li>
          <li>• Respond within 48 hours for best results</li>
          <li>• Address specific points mentioned in the review</li>
          <li>• Keep responses professional and courteous</li>
          <li>• Thank customers even for negative feedback</li>
        </ul>
      </div>
    </div>
  );
}