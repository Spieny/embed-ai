import { useEffect, useRef, RefObject } from "react";

type Message = {
  id?: string;
  content: string;
  role: 'system' | 'user' | 'assistant' | 'data';
  createdAt?: Date;
};
export function useScrollToBottom<T extends HTMLElement>(messages: Message[]): RefObject<T> {
    const containerRef = useRef<T>(null);

    useEffect(() => {
      const element = containerRef.current;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }, [messages]);

    return containerRef as RefObject<T>;
}