'use client';

import { BaseProps } from '@/types';
import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: React.ReactNode;
}

interface TabsProps extends BaseProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ 
  tabs, 
  defaultTab,
  onChange,
  className = '' 
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={className}>
      <div className="border-b border-[var(--color-border)]">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <div className="flex items-center gap-2">
                {tab.icon}
                {tab.label}
                {tab.badge !== undefined && (
                  <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                    activeTab === tab.id
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]" />
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="pt-4">
        {tabs.find(t => t.id === activeTab)?.children}
      </div>
    </div>
  );
}

export function TabPanel({ 
  children, 
  className = '' 
}: BaseProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}