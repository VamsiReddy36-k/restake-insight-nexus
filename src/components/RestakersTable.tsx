
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
import { ExternalLink, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const RestakersTable = () => {
  const { toast } = useToast();
  
  const { data: restakers, isLoading, error } = useQuery({
    queryKey: ['restakers'],
    queryFn: EigenLayerAPI.getRestakers,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blockchain-green/20 text-blockchain-green border-blockchain-green/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'withdrawn':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load restakers data</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead>User Address</TableHead>
              <TableHead>Amount Restaked</TableHead>
              <TableHead>Validator</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : (
              restakers?.map((restaker, index) => (
                <TableRow key={index} className="border-border/50 hover:bg-muted/10">
                  <TableCell className="font-mono">
                    <div className="flex items-center gap-2">
                      {formatAddress(restaker.userAddress)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(restaker.userAddress)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-blockchain-green">
                    {restaker.amountRestaked} stETH
                  </TableCell>
                  <TableCell className="font-mono">
                    <div className="flex items-center gap-2">
                      {formatAddress(restaker.targetAVSValidator)}
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(restaker.timestamp)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(restaker.status)}>
                      {restaker.status}
                    </Badge>
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

      {restakers && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {restakers.length} restaker{restakers.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};
