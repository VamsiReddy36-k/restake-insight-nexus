
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { EigenLayerAPI, RewardInfo } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Wallet, TrendingUp, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RewardsLookup = () => {
  const [address, setAddress] = useState('');
  const [rewardData, setRewardData] = useState<RewardInfo | null>(null);
  const { toast } = useToast();

  const rewardsMutation = useMutation({
    mutationFn: (address: string) => EigenLayerAPI.getRewards(address),
    onSuccess: (data) => {
      setRewardData(data);
      toast({
        title: "Success!",
        description: "Rewards data fetched successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch rewards data",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid Ethereum address",
        variant: "destructive",
      });
      return;
    }
    rewardsMutation.mutate(address.trim());
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Wallet Rewards Lookup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              placeholder="Enter Ethereum address (0x...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="font-mono"
            />
            <Button 
              type="submit" 
              disabled={rewardsMutation.isPending}
              className="bg-blockchain-purple hover:bg-blockchain-purple/80"
            >
              {rewardsMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Searching...
                </div>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Sample Addresses */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground mb-3">Try these sample addresses:</div>
          <div className="flex flex-wrap gap-2">
            {[
              '0x1234567890123456789012345678901234567890',
              '0x2345678901234567890123456789012345678901',
              '0x3456789012345678901234567890123456789012',
            ].map((sampleAddress) => (
              <Button
                key={sampleAddress}
                variant="outline"
                size="sm"
                onClick={() => setAddress(sampleAddress)}
                className="font-mono text-xs"
              >
                {formatAddress(sampleAddress)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {rewardsMutation.isPending && (
        <Card className="glass-card">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      )}

      {rewardData && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="glass-card glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blockchain-green" />
                Rewards Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blockchain-green">
                    {rewardData.totalRewards} ETH
                  </div>
                  <div className="text-sm text-muted-foreground">Total Rewards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blockchain-blue">
                    {rewardData.validatorBreakdown.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Validators</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blockchain-purple">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {formatDate(rewardData.lastUpdated)}
                  </div>
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border/50">
                <div className="text-sm text-muted-foreground">Wallet Address</div>
                <div className="font-mono text-sm">{rewardData.walletAddress}</div>
              </div>
            </CardContent>
          </Card>

          {/* Validator Breakdown */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blockchain-cyan" />
                Validator Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rewardData.validatorBreakdown.map((validator, index) => (
                  <div key={index} className="border border-border/50 rounded-lg p-4 glass-card">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-mono text-sm text-muted-foreground">
                          {formatAddress(validator.validatorAddress)}
                        </div>
                        <div className="text-lg font-semibold text-blockchain-green">
                          {validator.rewardsEarned} ETH
                        </div>
                      </div>
                      <Badge className="bg-blockchain-cyan/20 text-blockchain-cyan border-blockchain-cyan/30">
                        {validator.apy}% APY
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Recent Reward Timestamps:</div>
                      <div className="flex flex-wrap gap-2">
                        {validator.timestamps.map((timestamp, tIndex) => (
                          <Badge key={tIndex} variant="outline" className="text-xs">
                            {formatDate(timestamp)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
