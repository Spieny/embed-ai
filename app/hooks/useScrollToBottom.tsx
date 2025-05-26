import { Message } from "ai";
import { useEffect, useRef, RefObject } from "react";

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