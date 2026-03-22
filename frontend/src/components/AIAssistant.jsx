import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Code2, Sparkles, Loader2 } from 'lucide-react';
// Note: If react-markdown is not installed, we will just render standard text.

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi there! I am your AI Coding Assistant. Feel free to ask me any programming questions or paste your code for debugging.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        const handleOpenAI = (e) => {
            setIsOpen(true);
            if (e.detail) {
                setInput(e.detail);
                // Can't easily auto-send here because handleSend depends on state closures, 
                // but the input is pre-filled for the user to just hit Enter.
            }
        };
        window.addEventListener('open-ai-assistant', handleOpenAI);
        return () => window.removeEventListener('open-ai-assistant', handleOpenAI);
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userText = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userText }]);
        setInput('');
        setIsTyping(true);

        // MOCK AI LOGIC - Replace with actual API call (e.g., OpenAI or Gemini)
        setTimeout(() => {
            let aiResponse = '';
            
            if (userText.toLowerCase().includes('react')) {
                aiResponse = 'React is a fantastic JavaScript library for building user interfaces. Try using hooks like `useState` and `useEffect` to manage your component lifecycle and state!';
            } else if (userText.toLowerCase().includes('python')) {
                aiResponse = 'Python is great for both beginners and data science! Are you working with Django, Flask, or doing scripting? Here is a quick tip: use List Comprehensions `[x for x in list if condition]` for cleaner code.';
            } else if (userText.toLowerCase().includes('error') || userText.toLowerCase().includes('bug')) {
                aiResponse = 'Bugs are a normal part of coding! Please paste the exact error message or highlight the snippet, and I will help you debug it step-by-step.';
            } else if (userText.toLowerCase().includes('loop')) {
                aiResponse = 'Loops help you run code repeatedly. In JavaScript, you can use `for`, `while`, or array methods like `.map()` and `.forEach()`. Would you like an example?';
            } else {
                aiResponse = 'That is an excellent question! As your AI tutor, I can analyze code, explain concepts, and help you find the best algorithms. Can you provide a bit more context on what you are trying to build?';
            }

            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            {/* Floating Quick Action Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className={`
                    fixed bottom-6 right-6 z-[990] p-4 rounded-2xl shadow-2xl flex items-center justify-center
                    bg-gradient-to-br from-indigo-600 to-cyan-500 text-white
                    ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity
                `}
                style={{
                    boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5)'
                }}
            >
                <Sparkles size={26} className="absolute opacity-50 blur-[2px]" />
                <Bot size={28} className="relative z-10" />
            </motion.button>

            {/* AI Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="fixed bottom-6 right-6 z-[1000] w-[380px] h-[600px] max-h-[80vh] flex flex-col bg-white dark:bg-slate-900 rounded-[28px] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Code2 size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">AI Mentor</h3>
                                    <p className="text-xs text-white/80">Ask any coding question</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50 dark:bg-slate-950/50">
                            {messages.map((msg, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {/* Avatar */}
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center shrink-0
                                        ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white'}
                                    `}>
                                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={`
                                        px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed
                                        ${msg.role === 'user' 
                                            ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-500/20' 
                                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none shadow-sm'}
                                    `}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            
                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shrink-0">
                                        <Bot size={16} />
                                    </div>
                                    <div className="px-5 py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="Type your coding question..."
                                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-5 py-3.5 pr-14 rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                                >
                                    {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                            <div className="text-center mt-3">
                                <p className="text-[10px] text-slate-400 font-medium">AI can make mistakes. Verify critical code.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIAssistant;
