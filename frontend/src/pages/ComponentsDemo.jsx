import React, { useState } from 'react';
import { Button, Card, Input, Badge, Avatar, Modal } from '../components/ui';
import { Mail, Lock, User, Bell, ChevronRight, Play, CheckCircle2, Search } from 'lucide-react';

const ComponentsDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 px-4">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-6xl space-y-20">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <Badge variant="primary" className="mb-4">UI Kit 2.0</Badge>
          <h1 className="text-5xl md:text-7xl font-bold font-heading bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Tailwind Component Library
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            A premium collection of high-performance components built with Tailwind CSS and Framer Motion for the ultimate developer experience.
          </p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold font-heading border-l-4 border-indigo-600 pl-4 py-2">Buttons</h2>
          <Card className="flex flex-wrap gap-6 items-center">
            <Button variant="primary">Primary Action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline Style</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Delete Item</Button>
            <Button variant="primary" className="rounded-full w-12 h-12 p-0">
              <ChevronRight />
            </Button>
          </Card>
        </section>

        {/* Inputs Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold font-heading border-l-4 border-indigo-600 pl-4 py-2">Form Elements</h2>
          <Card className="grid md:grid-cols-2 gap-8">
            <Input label="Full Name" placeholder="John Doe" icon={User} />
            <Input label="Email Address" type="email" placeholder="john@example.com" icon={Mail} />
            <Input label="Password" type="password" placeholder="••••••••" icon={Lock} />
            <div className="flex items-end">
              <Button variant="primary" className="w-full">Create Account</Button>
            </div>
          </Card>
        </section>

        {/* Cards & Badges Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold font-heading border-l-4 border-indigo-600 pl-4 py-2">Data Display</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="space-y-4">
              <div className="flex justify-between items-start">
                <Avatar alt="JD" />
                <Badge variant="success">Active Now</Badge>
              </div>
              <div>
                <h3 className="text-xl font-bold">Modern Web Design</h3>
                <p className="text-slate-500 text-sm mt-2">Master the art of visual storytelling with CSS and Framer Motion.</p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-indigo-600 font-bold">$49.99</span>
                <Button variant="outline" className="px-4 py-2 text-sm">Enroll</Button>
              </div>
            </Card>

            <Card className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
                <Bell />
              </div>
              <h3 className="text-xl font-bold">Notifications</h3>
              <p className="text-slate-500 text-sm">Stay updated with the latest course releases and community discussions.</p>
              <div className="flex gap-2">
                <Badge variant="warning">New</Badge>
                <Badge variant="neutral">Beta</Badge>
              </div>
            </Card>

            <Card className="overflow-hidden p-0 group">
              <div className="h-40 bg-gradient-to-br from-indigo-600 to-violet-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-950 opacity-0 group-hover:opacity-40 transition-opacity flex items-center justify-center">
                  <Play className="text-white fill-white" size={48} />
                </div>
              </div>
              <div className="p-6 space-y-2">
                <Badge variant="danger">High Demand</Badge>
                <h3 className="text-xl font-bold">Live Workshop</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Certified Course</span>
                </div>
              </div>
            </Card>
          </div>
        </section>


        {/* Modal Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold font-heading border-l-4 border-indigo-600 pl-4 py-2">Interactions</h2>
          <Card className="flex items-center justify-center py-20 bg-indigo-600/5">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex items-center justify-center mx-auto text-indigo-600">
                 <Bell size={32} />
              </div>
              <h3 className="text-2xl font-bold">Interactive Modals</h3>
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Launch Modal Demo
              </Button>
            </div>
          </Card>
        </section>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Welcome Back!"
      >
        <div className="space-y-6">
          <p className="text-slate-500 dark:text-slate-400">
            Sign in to continue your learning journey and access exclusive student resources.
          </p>
          <div className="space-y-4">
            <Input label="Email" placeholder="your@email.com" icon={Mail} />
            <Input label="Password" type="password" placeholder="••••••••" icon={Lock} />
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1">Sign In</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ComponentsDemo;
