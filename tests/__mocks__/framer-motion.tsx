import React from 'react';

// Mock simple para framer-motion
const createMotionComponent = (tag: string) => {
  const MotionComponent = React.forwardRef<any, any>((props, ref) => {
    const { children, variants, custom, whileHover, whileTap, initial, animate, exit, ...rest } = props;
    return React.createElement(tag, { ...rest, ref }, children);
  });
  MotionComponent.displayName = `motion.${tag}`;
  return MotionComponent;
};

export const motion = {
  div: createMotionComponent('div'),
  button: createMotionComponent('button'),
  a: createMotionComponent('a'),
  p: createMotionComponent('p'),
  span: createMotionComponent('span'),
  section: createMotionComponent('section'),
  h1: createMotionComponent('h1'),
  h2: createMotionComponent('h2'),
  h3: createMotionComponent('h3'),
  ul: createMotionComponent('ul'),
  li: createMotionComponent('li'),
  img: createMotionComponent('img'),
  svg: createMotionComponent('svg'),
  path: createMotionComponent('path'),
  circle: createMotionComponent('circle'),
  rect: createMotionComponent('rect'),
  g: createMotionComponent('g'),
  text: createMotionComponent('text'),
  tspan: createMotionComponent('tspan'),
  line: createMotionComponent('line'),
  polygon: createMotionComponent('polygon'),
  polyline: createMotionComponent('polyline'),
  ellipse: createMotionComponent('ellipse'),
  defs: createMotionComponent('defs'),
  clipPath: createMotionComponent('clipPath'),
  linearGradient: createMotionComponent('linearGradient'),
  radialGradient: createMotionComponent('radialGradient'),
  stop: createMotionComponent('stop'),
  mask: createMotionComponent('mask'),
  pattern: createMotionComponent('pattern'),
  filter: createMotionComponent('filter'),
  feGaussianBlur: createMotionComponent('feGaussianBlur'),
  feOffset: createMotionComponent('feOffset'),
  feComposite: createMotionComponent('feComposite'),
  feFlood: createMotionComponent('feFlood'),
  feColorMatrix: createMotionComponent('feColorMatrix'),
  feBlend: createMotionComponent('feBlend'),
  feMorphology: createMotionComponent('feMorphology'),
  feTurbulence: createMotionComponent('feTurbulence'),
  feDisplacementMap: createMotionComponent('feDisplacementMap'),
  feImage: createMotionComponent('feImage'),
  feMerge: createMotionComponent('feMerge'),
  feMergeNode: createMotionComponent('feMergeNode'),
  feConvolveMatrix: createMotionComponent('feConvolveMatrix'),
  feDiffuseLighting: createMotionComponent('feDiffuseLighting'),
  feSpecularLighting: createMotionComponent('feSpecularLighting'),
  feDistantLight: createMotionComponent('feDistantLight'),
  fePointLight: createMotionComponent('fePointLight'),
  feSpotLight: createMotionComponent('feSpotLight'),
  feTile: createMotionComponent('feTile'),
  feFuncR: createMotionComponent('feFuncR'),
  feFuncG: createMotionComponent('feFuncG'),
  feFuncB: createMotionComponent('feFuncB'),
  feFuncA: createMotionComponent('feFuncA'),
  feComponentTransfer: createMotionComponent('feComponentTransfer'),
  feDropShadow: createMotionComponent('feDropShadow'),
};

export const MotionConfig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Mock hooks
export const useMotionValue = (initial: any) => ({ current: initial });
export const useTransform = (value: any, transform: any) => value;
export const useSpring = (value: any) => value;
export const useMotionTemplate = (template: any) => template;
export const useMotionValueEvent = () => {};
export const useAnimate = () => [() => {}, () => {}];
export const useInView = () => ({ ref: () => {}, inView: true });
export const useScroll = () => ({ scrollY: { current: 0 }, scrollX: { current: 0 } });

export default {
  motion,
  MotionConfig,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate,
  useMotionValueEvent,
  useAnimate,
  useInView,
  useScroll,
};
