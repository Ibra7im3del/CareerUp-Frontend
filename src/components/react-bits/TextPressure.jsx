import { useEffect, useRef, useState } from 'react';

export default function TextPressure({
  text = 'Job Portal',
  textColor = '#ffffff',
  minFontSize = 36,
}) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const [fontSize, setFontSize] = useState(minFontSize);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newFontSize = Math.max((containerWidth / text.length) * 1.1, minFontSize);
        setFontSize(newFontSize);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [text, minFontSize]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-transparent py-4 text-center">
      <h1
        ref={titleRef}
        className="font-black tracking-tight transition-all duration-300 select-none drop-shadow-[0_10px_20px_rgba(59,130,246,0.3)]"
        style={{
          fontSize: `${fontSize}px`,
          color: textColor,
        }}
      >
        {text}
      </h1>
    </div>
  );
}