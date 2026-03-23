import React, { useState } from 'react';
import { clsx } from 'clsx';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  
  return (
    <div className="w-full">
      <div className="flex space-x-2 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-6 py-3 font-medium transition-all rounded-t-xl',
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary bg-surface'
                : 'text-textSecondary hover:text-text hover:bg-surface/50'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};
