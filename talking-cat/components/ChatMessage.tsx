
import React from 'react';
import { type Message } from '../types';
import CatAvatar from './CatAvatar';
import LoadingIndicator from './LoadingIndicator';

interface ChatMessageProps {
  message: Message;
}

const UserIcon: React.FC = () => (
    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500 text-white font-bold text-lg shadow-md">
        You
    </div>
);


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, text } = message;

  const isModel = role === 'model';
  const isUser = role === 'user';
  const isError = role === 'error';

  const wrapperClasses = `flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`;
  const bubbleClasses = `max-w-xl rounded-2xl p-4 shadow-sm text-base ${
    isUser
      ? 'bg-indigo-500 text-white rounded-br-none'
      : 'bg-white text-slate-700 rounded-bl-none'
  } ${isError ? 'bg-red-100 text-red-700 border border-red-200' : ''}`;

  const avatar = isUser ? <UserIcon /> : <CatAvatar isTalking={false}/>;
  const showAvatar = isUser || text; // Show avatar for user, or for model if it has text

  const formattedText = text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));

  return (
    <div className={wrapperClasses}>
       {showAvatar && <div className="w-10 h-10 flex-shrink-0">{avatar}</div>}
      <div className={bubbleClasses}>
        {text ? formattedText : <LoadingIndicator />}
      </div>
    </div>
  );
};

export default ChatMessage;
