'use client';

import React, { useEffect, useState } from 'react';
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const extractWalletAddress = (address: string): string => {
  let cleanAddress = address.toLowerCase().trim();
  if (cleanAddress.startsWith('eip155:')) {
    const parts = address.split(':');
    return parts[parts.length - 1];
  }
  return cleanAddress;
};

export default function Page() {
  const { toast } = useToast();
  const [account, setAccount] = useState<string>('');
  const [pushUser, setPushUser] = useState<PushAPI | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newChatAddress, setNewChatAddress] = useState<string>('');
  const [stream, setStream] = useState<any>(null);

  const processNewMessage = (messageObj: any) => {
    if (!selectedChat) return;

    const messageFromAddress = extractWalletAddress(messageObj.fromCAIP10);
    const messageToAddress = extractWalletAddress(messageObj.toCAIP10);
    const selectedChatAddress = extractWalletAddress(
      selectedChat.walletAddress
    );

    if (
      messageFromAddress === selectedChatAddress ||
      messageToAddress === selectedChatAddress
    ) {
      const newMessage = {
        fromDID: messageObj.fromCAIP10,
        toDID: messageObj.toCAIP10,
        messageContent: messageObj.messageContent,
        timestamp: messageObj.timestamp,
      };

      setChatHistory((prevHistory) => {
        const updatedHistory = [...prevHistory, newMessage].sort(
          (a, b) => (a.timestamp || 0) - (b.timestamp || 0)
        );
        return updatedHistory;
      });
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'MetaMask not found. Please install MetaMask.',
        });
        return;
      }

      setIsLoading(true);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const user = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
      });
      setPushUser(user);

      const stream = await user.initStream([
        CONSTANTS.STREAM.NOTIF,
        CONSTANTS.STREAM.CHAT,
      ]);
      stream.on(CONSTANTS.STREAM.CHAT, (message: any) => {
        console.log('New message received:', message);
        processNewMessage(message);
      });
      stream.on(CONSTANTS.STREAM.NOTIF, (data: any) => {
        console.log('New notification received:', data);
        toast({
          title: `${data.from}`,
          description: 'New Notification!',
        });
      });
      stream.connect();

      setStream(stream);

      toast({
        title: 'Success',
        description: 'Wallet connected successfully!',
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to connect wallet',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChats = async () => {
    if (!pushUser) {
      console.error('PushUser is not initialized');
      return;
    }

    try {
      setIsLoading(true);
      const userChats = await pushUser.chat.list('CHATS');
      const processedChats = userChats.map((chat) => ({
        ...chat,
        walletAddress: extractWalletAddress(chat.did),
      }));
      setChats(processedChats);

      if (!selectedChat && processedChats.length > 0) {
        setSelectedChat(processedChats[0]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load chats',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    if (!pushUser || !selectedChat) {
      console.error('PushUser or selectedChat is not initialized');
      return;
    }

    try {
      setIsLoading(true);
      const history = await pushUser.chat.history(selectedChat.walletAddress);
      const sortedHistory = history.sort(
        (a: any, b: any) => (a.timestamp || 0) - (b.timestamp || 0)
      );
      setChatHistory(sortedHistory);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load chat history',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!pushUser || !selectedChat || !message.trim()) {
      console.error('PushUser, selectedChat, or message is not initialized');
      return;
    }

    try {
      setIsLoading(true);
      const sentMessage = await pushUser.chat.send(selectedChat.walletAddress, {
        type: 'Text',
        content: message,
      });

      const newMessage = {
        fromDID: `eip155:${account}`,
        toDID: `eip155:${selectedChat.walletAddress}`,
        messageContent: message,
        timestamp: Date.now(),
      };

      setChatHistory((prevHistory) => {
        const updatedHistory = [...prevHistory, newMessage].sort(
          (a, b) => (a.timestamp || 0) - (b.timestamp || 0)
        );
        return updatedHistory;
      });

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = async () => {
    if (!pushUser || !newChatAddress.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide a wallet address to start a new chat.',
      });
      return;
    }

    try {
      setIsLoading(true);

      const chatRequestMessage = await pushUser.chat.send(newChatAddress, {
        type: 'Text',
        content: 'Hello!',
      });

      setChats([
        ...chats,
        { walletAddress: newChatAddress, status: 'pending' },
      ]);
      setSelectedChat({ walletAddress: newChatAddress, status: 'pending' });

      setNewChatAddress('');

      toast({
        title: 'Chat Request Sent',
        description: 'Waiting for the recipient to accept your chat request.',
      });
    } catch (error) {
      console.error('Error starting new chat:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send chat request.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const acceptChatRequest = async () => {
    if (!pushUser || !selectedChat) {
      console.error('PushUser or selectedChat is not initialized');
      return;
    }

    try {
      setIsLoading(true);

      const acceptedChat = await pushUser.chat.accept(
        selectedChat.walletAddress
      );

      if (acceptedChat) {
        setSelectedChat((prev) => ({ ...prev, status: 'active' }));

        toast({
          title: 'Chat Accepted',
          description:
            'You have accepted the chat request. You can now send messages.',
        });
      }
    } catch (error) {
      console.error('Error accepting chat request:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to accept chat request.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (pushUser) {
      fetchChats();
    }
  }, [pushUser]);

  useEffect(() => {
    if (selectedChat) {
      fetchChatHistory();
    }
  }, [selectedChat]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        {!account ? (
          <Button
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
        ) : (
          <div className="text-sm text-gray-600">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1 border rounded p-4">
            <h2 className="text-xl font-bold mb-4">Chats</h2>
            <Button
              variant="ghost"
              onClick={() => setSelectedChat(null)}
              className="mb-4 w-full"
            >
              Start New Chat
            </Button>
            <div className="flex flex-col gap-2">
              {chats.map((chat, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => setSelectedChat(chat)}
                  className={`justify-start ${selectedChat?.walletAddress === chat.walletAddress ? 'bg-blue-100' : ''}`}
                  disabled={isLoading}
                >
                  {chat.walletAddress.slice(0, 6)}...
                  {chat.walletAddress.slice(-4)}
                </Button>
              ))}
            </div>
            {selectedChat === null && (
              <div className="flex gap-2 mt-4">
                <Input
                  type="text"
                  value={newChatAddress}
                  onChange={(e) => setNewChatAddress(e.target.value)}
                  placeholder="Enter wallet address"
                  className="flex-1"
                  disabled={isLoading || !account}
                />
                <Button
                  onClick={startNewChat}
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={isLoading || !newChatAddress.trim() || !account}
                >
                  {isLoading ? 'Creating...' : 'Start Chat'}
                </Button>
              </div>
            )}
          </div>

          <div className="col-span-2 border rounded p-4">
            <h2 className="text-xl font-bold mb-4">Chat History</h2>
            <div className="h-96 overflow-y-auto mb-4 flex flex-col gap-2">
              {chatHistory.map((msg, index) => {
                const isSender =
                  extractWalletAddress(msg.fromDID) ===
                  extractWalletAddress(account);
                const displayName = isSender
                  ? 'You'
                  : extractWalletAddress(msg.fromDID);

                return (
                  <div
                    key={index}
                    className={`p-2 rounded ${isSender ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}
                  >
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{displayName}</span>
                      <span>
                        {format(
                          toZonedTime(new Date(msg.timestamp), 'Asia/Bangkok'),
                          'HH:mm:ss'
                        )}
                      </span>
                    </div>
                    <div>{msg.messageContent}</div>
                  </div>
                );
              })}
            </div>

            {selectedChat && (
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isLoading || !account}
                />
                <Button
                  onClick={sendMessage}
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={isLoading || !message.trim() || !account}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
