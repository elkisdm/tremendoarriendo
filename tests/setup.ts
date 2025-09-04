import '@testing-library/jest-dom';
import React from 'react';

// Mock de Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
        };
    },
    useSearchParams() {
        return new URLSearchParams();
    },
    usePathname() {
        return '/';
    },
}));

// Mock de framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: 'div',
        button: 'button',
        h3: 'h3',
        p: 'p',
        span: 'span',
        section: 'section',
        article: 'article',
        header: 'header',
        footer: 'footer',
        nav: 'nav',
        main: 'main',
        aside: 'aside',
        form: 'form',
        input: 'input',
        textarea: 'textarea',
        select: 'select',
        option: 'option',
        label: 'label',
        img: 'img',
        svg: 'svg',
        path: 'path',
        circle: 'circle',
        rect: 'rect',
        line: 'line',
        polygon: 'polygon',
        polyline: 'polyline',
        ellipse: 'ellipse',
        g: 'g',
        defs: 'defs',
        clipPath: 'clipPath',
        mask: 'mask',
        pattern: 'pattern',
        linearGradient: 'linearGradient',
        radialGradient: 'radialGradient',
        stop: 'stop',
        animate: 'animate',
        animateMotion: 'animateMotion',
        animateTransform: 'animateTransform',
        set: 'set',
        mpath: 'mpath',
        text: 'text',
        tspan: 'tspan',
        textPath: 'textPath',
        tref: 'tref',
        altGlyph: 'altGlyph',
        altGlyphDef: 'altGlyphDef',
        altGlyphItem: 'altGlyphItem',
        glyph: 'glyph',
        glyphRef: 'glyphRef',
        font: 'font',
        fontFace: 'fontFace',
        fontFaceFormat: 'fontFaceFormat',
        fontFaceName: 'fontFaceName',
        fontFaceSrc: 'fontFaceSrc',
        fontFaceUri: 'fontFaceUri',
        hkern: 'hkern',
        vkern: 'vkern',
        missingGlyph: 'missingGlyph',
        use: 'use',
        symbol: 'symbol',
        marker: 'marker',
        metadata: 'metadata',
        title: 'title',
        desc: 'desc',
        foreignObject: 'foreignObject',
        switch: 'switch',
        script: 'script',
        style: 'style',
        view: 'view',
    },
    AnimatePresence: ({ children }: any) => children,
    useMotionValue: (value: any) => ({ get: () => value, set: jest.fn() }),
    useTransform: (value: any, transform: any) => ({ get: () => transform(value) }),
    useAnimation: () => ({
        start: jest.fn(),
        stop: jest.fn(),
        set: jest.fn(),
    }),
    useInView: () => true,
    useReducedMotion: () => false,
    useSpring: (value: any) => value,
    useScroll: () => ({
        scrollX: { get: () => 0 },
        scrollY: { get: () => 0 },
    }),
    useViewportScroll: () => ({
        scrollX: { get: () => 0 },
        scrollY: { get: () => 0 },
    }),
}));

// Mock de Notification API
Object.defineProperty(window, 'Notification', {
    value: {
        requestPermission: jest.fn().mockResolvedValue('granted'),
        permission: 'granted',
    },
    writable: true,
});

// Mock de window.open
Object.defineProperty(window, 'open', {
    value: jest.fn(),
    writable: true,
});

// Mock de navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
    value: jest.fn(),
    writable: true,
});

// Mock de matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock de localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock de sessionStorage
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
});

// Mock de fetch
global.fetch = jest.fn();

// Mock de console para evitar ruido en los tests
const originalConsole = console;
beforeAll(() => {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
});

afterAll(() => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
});

// Cleanup después de cada test
afterEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    sessionStorageMock.clear();
});
