import React from 'react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  isAnimating?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser, isAnimating }) => {
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-lg p-3 text-sm',
          isUser ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800',
          isAnimating && 'animate-pulse'
        )}
      >
        {message}
      </div>
    </div>
  );
};

export default MessageBubble;