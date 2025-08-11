import { WaitlistRequestSchema } from '@schemas/models';

describe('Waitlist Schema Validation', () => {
  it('should accept valid email', () => {
    const data = { email: 'test@example.com' };
    const result = WaitlistRequestSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should accept email and phone', () => {
    const data = { 
      email: 'test@example.com',
      phone: '+56912345678'
    };
    const result = WaitlistRequestSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const data = { email: 'invalid-email' };
    const result = WaitlistRequestSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject missing email', () => {
    const data = {};
    const result = WaitlistRequestSchema.safeParse(data);
    expect(result.success).toBe(false);
  });


});
