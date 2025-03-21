'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { connectWallet } from '@/lib/voting';
import { useStore } from '@/hooks/store';

export function ConnectWalletButton() {
  const { address, setAddress } = useStore();

  useEffect(() => {
    async function checkConnectedWallet() {
      if (window.ethereum?.selectedAddress) {
        setAddress(window.ethereum.selectedAddress);
      }
    }
    checkConnectedWallet();
  }, [setAddress]);

  const handleConnect = async () => {
    try {
      const address = await connectWallet();
      setAddress(address);
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  return (
    <Button onClick={handleConnect} variant="outline" className='border-green-600 border-2 bg-green-600/50'>
      {address ? truncateAddress(address) : 'Connect Wallet'}
    </Button>
  );
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}