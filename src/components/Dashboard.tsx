
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RestakersTable } from './RestakersTable';
import { ValidatorsTable } from './ValidatorsTable';
import { RewardsLookup } from './RewardsLookup';
import { StatsOverview } from './StatsOverview';
import { Shield, Users, Coins } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blockchain-darker via-blockchain-dark to-blockchain-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blockchain-purple mr-3 animate-glow" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blockchain-purple via-blockchain-blue to-blockchain-cyan bg-clip-text text-transparent">
              EigenLayer Restaking Nexus
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive restaking analytics and validator insights for the EigenLayer ecosystem
          </p>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 glass-card p-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="restakers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Restakers
            </TabsTrigger>
            <TabsTrigger value="validators" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Validators
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <StatsOverview />
          </TabsContent>

          <TabsContent value="restakers" className="space-y-6">
            <div className="glass-card rounded-xl p-6 glow-border">
              <h2 className="text-2xl font-bold mb-4 text-blockchain-purple">Active Restakers</h2>
              <p className="text-muted-foreground mb-6">
                Users who have restaked their stETH tokens through EigenLayer protocol
              </p>
              <RestakersTable />
            </div>
          </TabsContent>

          <TabsContent value="validators" className="space-y-6">
            <div className="glass-card rounded-xl p-6 glow-border">
              <h2 className="text-2xl font-bold mb-4 text-blockchain-blue">Validator Network</h2>
              <p className="text-muted-foreground mb-6">
                Comprehensive validator metrics including stake, performance, and slash history
              </p>
              <ValidatorsTable />
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <div className="glass-card rounded-xl p-6 glow-border">
              <h2 className="text-2xl font-bold mb-4 text-blockchain-cyan">Rewards Analytics</h2>
              <p className="text-muted-foreground mb-6">
                Track restaking rewards and performance for specific wallet addresses
              </p>
              <RewardsLookup />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
