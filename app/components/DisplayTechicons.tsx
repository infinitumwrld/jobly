'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn, getTechLogos } from "@/lib/utils";

interface TechIconProps {
  techStack: string[];
}

const DisplayTechicons = ({ techStack }: TechIconProps) => {
  const [icons, setIcons] = useState<{ tech: string; url: string }[]>([]);

  useEffect(() => {
    let mounted = true;
    getTechLogos(techStack).then((data) => {
      if (mounted) setIcons(data);
    });
    return () => {
      mounted = false;
    };
  }, [techStack]);

  if (!icons.length) {
    return <div className="h-5" />;
  }

  return (
    <div className="flex items-center gap-1 max-sm:mt-1">
      {icons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={`${tech}-${index}`}
          className={cn(
            "relative group bg-dark-300/50 rounded-full p-1.5 flex items-center justify-center hover:bg-dark-300 transition-colors",
            index >= 1 && "-ml-1.5 max-sm:-ml-1"
          )}
        >
          {/* Hidden tooltip that only shows on hover */}
          <span className="tech-tooltip max-sm:hidden">{tech}</span>
          
          <Image
            src={url}
            alt={tech}
            width={100}
            height={100}
            className="size-5 max-sm:size-4 opacity-80 group-hover:opacity-100 transition-opacity"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechicons;