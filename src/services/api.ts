
// Mock data service for EigenLayer restaking information
// In production, this would connect to actual EigenLayer subgraphs and onchain data

export interface Restaker {
  userAddress: string;
  amountRestaked: string;
  targetAVSValidator: string;
  timestamp: string;
  status: 'active' | 'pending' | 'withdrawn';
}

export interface Validator {
  operatorAddress: string;
  operatorId: string;
  totalDelegatedStake: string;
  slashHistory: SlashEvent[];
  status: 'active' | 'jailed' | 'slashed' | 'inactive';
  commission: string;
  apy: string;
}

export interface SlashEvent {
  timestamp: string;
  amount: string;
  reason: string;
  txHash: string;
}

export interface RewardInfo {
  walletAddress: string;
  totalRewards: string;
  validatorBreakdown: ValidatorReward[];
  lastUpdated: string;
}

export interface ValidatorReward {
  validatorAddress: string;
  rewardsEarned: string;
  timestamps: string[];
  apy: string;
}

// Mock data generators
const generateMockRestakers = (): Restaker[] => {
  const mockAddresses = [
    '0x1234567890123456789012345678901234567890',
    '0x2345678901234567890123456789012345678901',
    '0x3456789012345678901234567890123456789012',
    '0x4567890123456789012345678901234567890123',
    '0x5678901234567890123456789012345678901234',
  ];

  const mockValidators = [
    '0xabc1234567890123456789012345678901234567890',
    '0xdef2345678901234567890123456789012345678901',
    '0x9876543210987654321098765432109876543210',
  ];

  return mockAddresses.map((address, index) => ({
    userAddress: address,
    amountRestaked: (Math.random() * 100 + 10).toFixed(2),
    targetAVSValidator: mockValidators[index % mockValidators.length],
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: ['active', 'pending', 'withdrawn'][Math.floor(Math.random() * 3)] as any,
  }));
};

const generateMockValidators = (): Validator[] => {
  const mockValidators = [
    '0xabc1234567890123456789012345678901234567890',
    '0xdef2345678901234567890123456789012345678901',
    '0x9876543210987654321098765432109876543210',
  ];

  return mockValidators.map((address, index) => ({
    operatorAddress: address,
    operatorId: `operator_${index + 1}`,
    totalDelegatedStake: (Math.random() * 10000 + 1000).toFixed(2),
    slashHistory: Math.random() > 0.7 ? [{
      timestamp: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      amount: (Math.random() * 100).toFixed(2),
      reason: ['Double signing', 'Downtime', 'Invalid attestation'][Math.floor(Math.random() * 3)],
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`
    }] : [],
    status: ['active', 'jailed', 'slashed', 'inactive'][Math.floor(Math.random() * 4)] as any,
    commission: (Math.random() * 10 + 1).toFixed(1),
    apy: (Math.random() * 15 + 5).toFixed(2),
  }));
};

const generateMockRewards = (address: string): RewardInfo => {
  const validatorRewards: ValidatorReward[] = [
    {
      validatorAddress: '0xabc1234567890123456789012345678901234567890',
      rewardsEarned: (Math.random() * 50 + 10).toFixed(4),
      timestamps: [
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      ],
      apy: (Math.random() * 15 + 5).toFixed(2),
    },
    {
      validatorAddress: '0xdef2345678901234567890123456789012345678901',
      rewardsEarned: (Math.random() * 30 + 5).toFixed(4),
      timestamps: [
        new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      ],
      apy: (Math.random() * 15 + 5).toFixed(2),
    },
  ];

  const totalRewards = validatorRewards.reduce((sum, reward) => 
    sum + parseFloat(reward.rewardsEarned), 0
  ).toFixed(4);

  return {
    walletAddress: address,
    totalRewards,
    validatorBreakdown: validatorRewards,
    lastUpdated: new Date().toISOString(),
  };
};

// API service functions
export class EigenLayerAPI {
  private static baseDelay = 500; // Simulate network delay

  private static async simulateNetworkCall<T>(data: T): Promise<T> {
    await new Promise(resolve => setTimeout(resolve, this.baseDelay + Math.random() * 500));
    return data;
  }

  static async getRestakers(): Promise<Restaker[]> {
    console.log('Fetching restakers data...');
    return this.simulateNetworkCall(generateMockRestakers());
  }

  static async getValidators(): Promise<Validator[]> {
    console.log('Fetching validators data...');
    return this.simulateNetworkCall(generateMockValidators());
  }

  static async getRewards(address: string): Promise<RewardInfo> {
    console.log(`Fetching rewards for address: ${address}`);
    if (!address || address.length < 42) {
      throw new Error('Invalid Ethereum address format');
    }
    return this.simulateNetworkCall(generateMockRewards(address));
  }
}
