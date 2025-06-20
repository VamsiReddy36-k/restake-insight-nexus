
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EigenLayerAPI } from '@/services/api';
import { TrendingUp, Users, Shield, DollarSign, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const StatsOverview = () => {
  const [totalStats, setTotalStats] = useState({
    totalRestaked: '0',
    totalRestakers: 0,
    totalValidators: 0,
    avgAPY: '0',
    totalRewards: '0'
  });

  const { data: restakers, isLoading: restakersLoading } = useQuery({
    queryKey: ['restakers'],
    queryFn: EigenLayerAPI.getRestakers,
  });

  const { data: validators, isLoading: validatorsLoading } = useQuery({
    queryKey: ['validators'],
    queryFn: EigenLayerAPI.getValidators,
  });

  useEffect(() => {
    if (restakers && validators) {
      const totalRestaked = restakers.reduce((sum, restaker) => 
        sum + parseFloat(restaker.amountRestaked), 0
      ).toFixed(2);

      const avgAPY = validators.reduce((sum, validator) => 
        sum + parseFloat(validator.apy), 0
      ) / validators.length;

      const totalRewards = (parseFloat(totalRestaked) * (avgAPY / 100) * 0.25).toFixed(2); // Rough estimate

      setTotalStats({
        totalRestaked,
        totalRestakers: restakers.length,
        totalValidators: validators.length,
        avgAPY: avgAPY.toFixed(2),
        totalRewards
      });
    }
  }, [restakers, validators]);

  const isLoading = restakersLoading || validatorsLoading;

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    description 
  }: { 
    title: string; 
    value: string; 
    icon: any; 
    color: string;
    description: string;
  }) => (
    <Card className="glass-card glow-border hover:scale-105 transition-transform duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20 mb-1" />
        ) : (
          <div className="text-2xl font-bold text-foreground">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Key Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Restaked"
          value={`${totalStats.totalRestaked} stETH`}
          icon={TrendingUp}
          color="text-blockchain-green"
          description="Total stETH restaked"
        />
        <StatCard
          title="Active Restakers"
          value={totalStats.totalRestakers.toString()}
          icon={Users}
          color="text-blockchain-blue"
          description="Unique restaker addresses"
        />
        <StatCard
          title="Validators"
          value={totalStats.totalValidators.toString()}
          icon={Shield}
          color="text-blockchain-purple"
          description="Active validator operators"
        />
        <StatCard
          title="Average APY"
          value={`${totalStats.avgAPY}%`}
          icon={Activity}
          color="text-blockchain-cyan"
          description="Network average yield"
        />
        <StatCard
          title="Total Rewards"
          value={`${totalStats.totalRewards} ETH`}
          icon={DollarSign}
          color="text-blockchain-green"
          description="Estimated rewards distributed"
        />
      </div>

      {/* Protocol Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card glow-border">
          <CardHeader>
            <CardTitle className="text-blockchain-purple">Protocol Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Protocol</span>
              <span className="font-medium">EigenLayer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network</span>
              <span className="font-medium">Ethereum Mainnet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Asset Type</span>
              <span className="font-medium">Liquid Staking Tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Primary Asset</span>
              <span className="font-medium">stETH</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card glow-border">
          <CardHeader>
            <CardTitle className="text-blockchain-blue">API Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="font-mono text-sm space-y-2">
              <div className="p-2 bg-muted/20 rounded">
                <span className="text-blockchain-green">GET</span> /restakers
              </div>
              <div className="p-2 bg-muted/20 rounded">
                <span className="text-blockchain-blue">GET</span> /validators
              </div>
              <div className="p-2 bg-muted/20 rounded">
                <span className="text-blockchain-cyan">GET</span> /rewards/:address
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
