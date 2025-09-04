import '@testing-library/jest-dom';

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
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
        h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
        section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
        article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
        header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
        footer: ({ children, ...props }: any) => <footer {...props}>{children}</footer>,
        nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
        main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
        aside: ({ children, ...props }: any) => <aside {...props}>{children}</aside>,
        form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
        input: (props: any) => <input {...props} />,
        textarea: (props: any) => <textarea {...props} />,
        select: ({ children, ...props }: any) => <select {...props}>{children}</select>,
        option: ({ children, ...props }: any) => <option {...props}>{children}</option>,
        label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
        img: (props: any) => <img {...props} />,
        svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
        path: (props: any) => <path {...props} />,
        circle: (props: any) => <circle {...props} />,
        rect: (props: any) => <rect {...props} />,
        line: (props: any) => <line {...props} />,
        polygon: (props: any) => <polygon {...props} />,
        polyline: (props: any) => <polyline {...props} />,
        ellipse: (props: any) => <ellipse {...props} />,
        g: ({ children, ...props }: any) => <g {...props}>{children}</g>,
        defs: ({ children, ...props }: any) => <defs {...props}>{children}</defs>,
        clipPath: ({ children, ...props }: any) => <clipPath {...props}>{children}</clipPath>,
        mask: ({ children, ...props }: any) => <mask {...props}>{children}</mask>,
        pattern: ({ children, ...props }: any) => <pattern {...props}>{children}</pattern>,
        linearGradient: ({ children, ...props }: any) => <linearGradient {...props}>{children}</linearGradient>,
        radialGradient: ({ children, ...props }: any) => <radialGradient {...props}>{children}</radialGradient>,
        stop: (props: any) => <stop {...props} />,
        animate: ({ children, ...props }: any) => <animate {...props}>{children}</animate>,
        animateMotion: ({ children, ...props }: any) => <animateMotion {...props}>{children}</animateMotion>,
        animateTransform: ({ children, ...props }: any) => <animateTransform {...props}>{children}</animateTransform>,
        set: (props: any) => <set {...props} />,
        mpath: (props: any) => <mpath {...props} />,
        text: ({ children, ...props }: any) => <text {...props}>{children}</text>,
        tspan: ({ children, ...props }: any) => <tspan {...props}>{children}</tspan>,
        textPath: ({ children, ...props }: any) => <textPath {...props}>{children}</textPath>,
        tref: (props: any) => <tref {...props} />,
        altGlyph: ({ children, ...props }: any) => <altGlyph {...props}>{children}</altGlyph>,
        altGlyphDef: ({ children, ...props }: any) => <altGlyphDef {...props}>{children}</altGlyphDef>,
        altGlyphItem: ({ children, ...props }: any) => <altGlyphItem {...props}>{children}</altGlyphItem>,
        glyph: (props: any) => <glyph {...props} />,
        glyphRef: (props: any) => <glyphRef {...props} />,
        font: ({ children, ...props }: any) => <font {...props}>{children}</font>,
        fontFace: (props: any) => <fontFace {...props} />,
        fontFaceFormat: (props: any) => <fontFaceFormat {...props} />,
        fontFaceName: (props: any) => <fontFaceName {...props} />,
        fontFaceSrc: (props: any) => <fontFaceSrc {...props} />,
        fontFaceUri: (props: any) => <fontFaceUri {...props} />,
        hkern: (props: any) => <hkern {...props} />,
        vkern: (props: any) => <vkern {...props} />,
        missingGlyph: (props: any) => <missingGlyph {...props} />,
        use: (props: any) => <use {...props} />,
        symbol: ({ children, ...props }: any) => <symbol {...props}>{children}</symbol>,
        marker: ({ children, ...props }: any) => <marker {...props}>{children}</marker>,
        metadata: ({ children, ...props }: any) => <metadata {...props}>{children}</metadata>,
        title: ({ children, ...props }: any) => <title {...props}>{children}</title>,
        desc: ({ children, ...props }: any) => <desc {...props}>{children}</desc>,
        foreignObject: ({ children, ...props }: any) => <foreignObject {...props}>{children}</foreignObject>,
        switch: ({ children, ...props }: any) => <switch {...props}>{children}</switch>,
        script: ({ children, ...props }: any) => <script {...props}>{children}</script>,
        style: ({ children, ...props }: any) => <style {...props}>{children}</style>,
        view: (props: any) => <view {...props} />,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
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
    useTransform: (value: any, transform: any) => ({ get: () => transform(value) }),
    useMotionValue: (value: any) => ({ get: () => value, set: jest.fn() }),
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
