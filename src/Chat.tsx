import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

type Message = {
  name: string,
  text: string,
};

type ChatProps = {
  name: string
};

const ChatMessage: React.VFC<Message> = ({ name, text }) => (
  <div>
    <h6>{name}</h6>
    <p>{text}</p>
  </div>
);

const Chat: React.VFC<ChatProps> = ({ name }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const socketRef = useRef(io('http://localhost:3000'));

  useEffect(() => {
    socketRef.current.on('broadcast', (mess: Message[]) => {
      setMessages(mess);
    });

    socketRef.current.emit('login', name);

    return () => {
      console.log('Disconnecting..');
      socketRef.current.disconnect();
    };
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = (n: string, t: string | undefined): void => {
    if (!t) return;
    const aMessage = {
      name: n,
      text: t,
    };
    socketRef.current.emit('send', aMessage);
  };

  return (
    <div>
      <div className="input">
        <input
          type="text"
          placeholder="メッセージ"
          ref={inputRef}
        />
        <button
          type="button"
          disabled={!inputRef}
          onClick={() => sendMessage(name, inputRef?.current?.value)}
        >
          送信
        </button>
      </div>
      <ul>
        {messages.map((msg: Message) => (
          <ChatMessage name={msg.name} text={msg.text} />
        ))}
      </ul>
    </div>
  );
};

export default Chat;
