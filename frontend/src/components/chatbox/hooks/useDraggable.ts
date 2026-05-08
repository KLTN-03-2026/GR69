import { useState, useRef, useEffect } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

export function useDraggable() {
  const positionRef = useRef({ x: 0, y: 0 });
  const [renderPos, setRenderPos] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging.current) return;
      e.preventDefault();
      positionRef.current = {
        x: positionRef.current.x + (e.clientX - dragStart.current.x),
        y: positionRef.current.y + (e.clientY - dragStart.current.y),
      };
      dragStart.current = { x: e.clientX, y: e.clientY };
      setRenderPos({ ...positionRef.current });
    }
    
    function handleMouseUp() {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.userSelect = 'auto';
      }
    }
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  function handleMouseDown(e: ReactMouseEvent<Element>) {
    if ((e.target as HTMLElement).closest('.chatbox-close-btn') ||
        (e.target as HTMLElement).closest('.chatbox-input-area')) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    document.body.style.userSelect = 'none';
  }

  return { renderPos, handleMouseDown };
}