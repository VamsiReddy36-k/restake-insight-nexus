
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { EigenLayerAPI } from '@/services/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ValidatorsTable = () => {
  const { toast } = useToast();
  
  const { data: validators, isLoading, error } = useQuery({
    queryKey: ['validators'],
    queryFn: EigenLayerAPI.getValidators,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blockchain-green/20 text-blockchain-green border-blockchain-green/30';
      case 'jailed':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'slashed':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string, hasSlashHistory: boolean) => {
    if (hasSlashHistory) {
      return <AlertTriangle className="h-3 w-3 text-destructive" />;
    }
    if (status === 'active') {
      return <Shield className="h-3 w-3 text-blockchain-green" />;
    }
    return null;
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load validators data</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead>Operator</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Total Stake</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>APY</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Slash History</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : (
              validators?.map((validator, index) => (
                <TableRow key={index} className="border-border/50 hover:bg-muted/10">
                  <TableCell className="font-mono">
                    <div className="flex items-center gap-2">
                      {formatAddress(validator.operatorAddress)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(validator.operatorAddress)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-blockchain-blue">
                    {validator.operatorId}
                  </TableCell>
                  <TableCell className="font-semibold text-blockchain-purple">
                    {parseFloat(validator.totalDelegatedStake).toLocaleString()} ETH
                  </TableCell>
                  <TableCell>{validator.commission}%</TableCell>
                  <TableCell className="font-semibold text-blockchain-green">
                    {validator.apy}%
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(validator.status)}>
                        {validator.status}
                      </Badge>
                      {getStatusIcon(validator.status, validator.slashHistory.length > 0)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {validator.slashHistory.length > 0 ? (
                      <div className="text-destructive text-sm">
                        {validator.slashHistory.length} event{validator.slashHistory.length > 1 ? 's' : ''}
                      </div>
                    ) : (
                      <div className="text-blockchain-green text-sm">Clean</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {validators && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {validators.length} validator{validators.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};
