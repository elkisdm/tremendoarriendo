export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function isProduction(): boolean {
	return process.env.NODE_ENV === 'production';
}

function sanitize(value: unknown): unknown {
	if (value == null) return value;
	if (typeof value === 'string') {
		// Ocultar emails y teléfonos simples
		const withoutEmails = value.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]');
		const withoutPhones = withoutEmails.replace(/[+]?\d[\d\s().-]{7,}\d/g, '[redacted-phone]');
		return withoutPhones;
	}
	if (Array.isArray(value)) return value.map(sanitize);
	if (typeof value === 'object') {
		const obj = value as Record<string, unknown>;
		const sanitized: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(obj)) {
			if (/password|secret|token|key|email|phone|tel|whatsapp/i.test(k)) {
				sanitized[k] = '[redacted]';
			} else {
				sanitized[k] = sanitize(v);
			}
		}
		return sanitized;
	}
	return value;
}

function format(message: unknown, meta?: unknown): unknown[] {
	const safeMessage = sanitize(message);
	if (meta === undefined) return [safeMessage];
	return [safeMessage, sanitize(meta)];
}

export const logger = {
	debug(message: unknown, meta?: unknown): void {
		if (isProduction()) return; // no debug en producción
		console.debug(...format(message, meta));
	},
	info(message: unknown, meta?: unknown): void {
		console.info(...format(message, meta));
	},
	warn(message: unknown, meta?: unknown): void {
		console.warn(...format(message, meta));
	},
	error(message: unknown, meta?: unknown): void {
		console.error(...format(message, meta));
	},
};