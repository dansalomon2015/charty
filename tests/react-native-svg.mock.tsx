import React from 'react';

type SvgProps = React.SVGProps<SVGSVGElement> & {
  children?: React.ReactNode;
};

export default function Svg({ children, ...props }: SvgProps) {
  return <svg {...props}>{children}</svg>;
}

export const Circle = (props: React.SVGProps<SVGCircleElement>) => (
  <circle {...props} />
);
export const Defs = (props: React.SVGProps<SVGDefsElement>) => <defs {...props} />;
export const G = (props: React.SVGProps<SVGGElement>) => <g {...props} />;
export const LinearGradient = (
  props: React.SVGProps<SVGLinearGradientElement>
) => <linearGradient {...props} />;
export const Line = (props: React.SVGProps<SVGLineElement>) => <line {...props} />;
export const Path = (props: React.SVGProps<SVGPathElement>) => <path {...props} />;
export const Rect = (props: React.SVGProps<SVGRectElement>) => <rect {...props} />;
export const Stop = (props: React.SVGProps<SVGStopElement>) => <stop {...props} />;
export const Text = (props: React.SVGProps<SVGTextElement>) => <text {...props} />;
