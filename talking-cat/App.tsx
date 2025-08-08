
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { chat } from './services/geminiService';
import { type Message, type Role } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import CatAvatar from './components/CatAvatar';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello there! I'm a cat of many words. Ask me anything... or just tell me about your day. I'm all ears. Meow.",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = { role: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage]);

    // Add placeholder for model's response
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    try {
      const stream = await chat.sendMessageStream({ message: prompt });
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'model') {
            lastMessage.text += chunkText;
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'error',
        text: 'Oops! I seem to have lost my train of thought... Could you try that again?',
      };
      // Replace the placeholder with the error message
      setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = errorMessage;
          return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-md p-4 flex items-center justify-center space-x-4 sticky top-0 z-10 border-b-2 border-slate-200">
        <div className="w-12 h-12">
            <CatAvatar isTalking={isLoading} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Talking Cat</h1>
            <p className="text-sm text-slate-500">Powered by Gemini</p>
        </div>
      </header>

      <main 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
      </main>

      <footer className="bg-white p-4 border-t-2 border-slate-200">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default App;
