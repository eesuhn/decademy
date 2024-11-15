'use client';

import { VerifiedBadge } from '@/components/VerifiedBadge';
import { BsTwitterX } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { NounsAvatar } from './NounsAvatar';

interface ProfileHeaderProps {
  walletAddress: string;
  name: string;
  socialLinks?: Array<{ platform: 'twitter' | 'github'; url: string }>;
}

const socialIcons = {
  twitter: BsTwitterX,
  github: FaGithub,
};

export function ProfileHeader({
  walletAddress,
  name,
  socialLinks = [],
}: ProfileHeaderProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#eeeee4]/80 to-[#abdbe3]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ opacity: 0.4 }}
        />
      </div>

      <div className="relative px-8 py-12 text-black">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white/10 bg-gray-300">
              <NounsAvatar walletAddress={walletAddress} size="lg" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-bold text-black">{name}</h2>
              <VerifiedBadge className="mt-1" />
            </div>
            <p className="text-sm text-black/70">
              {walletAddress.length > 8
                ? `${walletAddress.substring(0, 8)}...`
                : walletAddress}
            </p>
          </div>

          <div className="flex gap-3">
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.platform];
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black/70 hover:text-black transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
