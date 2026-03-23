import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">Settings</h1>
        <p className="text-textSecondary">Configure your pharmacy management system.</p>
      </div>
      
      <Card className="text-center py-20">
        <SettingsIcon className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold text-text mb-2">System Settings</h3>
        <p className="text-textSecondary">Settings panel coming soon...</p>
      </Card>
    </div>
  );
};
