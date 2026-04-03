import React from "react";

function MockImage({
  src,
  alt,
  width,
  height,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string | { src: string };
  priority?: boolean;
  fill?: boolean;
}) {
  const imgSrc = typeof src === "object" ? src.src : src;
  return <img src={imgSrc} alt={alt} width={width} height={height} {...props} />;
}

export default MockImage;
