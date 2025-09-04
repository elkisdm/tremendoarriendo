import { NextRequest } from 'next/server';
import { POST } from '@/app/api/visits/route';

describe('/api/visits', () => {
    describe('POST', () => {
        const validVisitData = {
            listingId: 'test-listing',
            slotId: 'slot-123',
            userId: 'user-456',
            channel: 'web',
            idempotencyKey: 'unique-key-789'
        };

        it('debería crear visita correctamente', async () => {
            const request = new NextRequest('http://localhost:3000/api/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotency-Key': 'unique-key-789'
                },
                body: JSON.stringify(validVisitData)
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data).toHaveProperty('visitId');
            expect(data).toHaveProperty('status', 'confirmed');
            expect(data).toHaveProperty('message');
            expect(data.visitId).toMatch(/^visit_/);
        });

        it('debería validar datos requeridos', async () => {
            const invalidData = {
                listingId: 'test-listing',
                // slotId faltante
                userId: 'user-456',
                channel: 'web'
            };

            const request = new NextRequest('http://localhost:3000/api/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invalidData)
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toHaveProperty('error');
            expect(data.error).toContain('slotId');
        });

        it('debería validar idempotency key', async () => {
            const request = new NextRequest('http://localhost:3000/api/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // Idempotency-Key faltante
                },
                body: JSON.stringify(validVisitData)
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toHaveProperty('error');
            expect(data.error).toContain('Idempotency-Key');
        });

        it('debería manejar slot no disponible', async () => {
            const unavailableSlotData = {
                ...validVisitData,
                slotId: 'unavailable-slot'
            };

            const request = new NextRequest('http://localhost:3000/api/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotency-Key': 'unique-key-790'
                },
                body: JSON.stringify(unavailableSlotData)
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(409);
            expect(data).toHaveProperty('error');
            expect(data.error).toContain('no disponible');
        });

        it('debería manejar listingId inexistente', async () => {
            const invalidListingData = {
                ...validVisitData,
                listingId: 'non-existent-listing'
            };

            const request = new NextRequest('http://localhost:3000/api/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotency-Key': 'unique-key-791'
                },
                body: JSON.stringify(invalidListingData)
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(404);
            expect(data).toHaveProperty('error');
            expect(data.error).toContain('no encontrado');
        });

        it('debería prevenir duplicados con idempotency key', async () => {
            const request1 = new NextRequest('http://localhost:3000/api/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotency-Key': 'duplicate-key-123'
                },
                body: JSON.stringify(validVisitData)
            });

            const request2 = new NextRequest('http://localhost:3000/api/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotency-Key': 'duplicate-key-123'
                },
                body: JSON.stringify(validVisitData)
            });

            // Primera llamada
            const response1 = await POST(request1);
            expect(response1.status).toBe(201);

            // Segunda llamada con la misma key
            const response2 = await POST(request2);
            const data2 = await response2.json();

            expect(response2.status).toBe(409);
            expect(data2).toHaveProperty('error');
            expect(data2.error).toContain('duplicada');
        });

        it('debería validar formato de JSON', async () => {
            const request = new NextRequest('http://localhost:3000/api/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotency-Key': 'unique-key-792'
                },
                body: 'invalid-json'
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toHaveProperty('error');
            expect(data.error).toContain('JSON');
        });

        it('debería validar Content-Type', async () => {
            const request = new NextRequest('http://localhost:3000/api/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                    'Idempotency-Key': 'unique-key-793'
                },
                body: JSON.stringify(validVisitData)
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toHaveProperty('error');
            expect(data.error).toContain('Content-Type');
        });

        it('debería incluir headers CORS correctos', async () => {
            const request = new NextRequest('http://localhost:3000/api/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotency-Key': 'unique-key-794'
                },
                body: JSON.stringify(validVisitData)
            });

            const response = await POST(request);

            expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
            expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, POST, PUT, DELETE, OPTIONS');
            expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type, Authorization');
        });

        it('debería retornar datos de la visita creada', async () => {
            const request = new NextRequest('http://localhost:3000/api/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotency-Key': 'unique-key-795'
                },
                body: JSON.stringify(validVisitData)
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data).toHaveProperty('visitId');
            expect(data).toHaveProperty('listingId', validVisitData.listingId);
            expect(data).toHaveProperty('slotId', validVisitData.slotId);
            expect(data).toHaveProperty('userId', validVisitData.userId);
            expect(data).toHaveProperty('channel', validVisitData.channel);
            expect(data).toHaveProperty('createdAt');
            expect(data).toHaveProperty('status', 'confirmed');
        });

        it('debería manejar errores de base de datos', async () => {
            // Simular error de base de datos
            const request = new NextRequest('http://localhost:3000/api/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotency-Key': 'db-error-key'
                },
                body: JSON.stringify({
                    ...validVisitData,
                    listingId: 'db-error-listing'
                })
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toHaveProperty('error');
            expect(data.error).toContain('base de datos');
        });

        it('debería validar rate limiting', async () => {
            const requests = Array(25).fill(null).map((_, index) => 
                new NextRequest('http://localhost:3000/api/visits', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Idempotency-Key': `rate-limit-key-${index}`
                    },
                    body: JSON.stringify(validVisitData)
                })
            );

            // Ejecutar todas las requests
            const responses = await Promise.all(requests.map(req => POST(req)));

            // La última request debería ser rate limited
            const lastResponse = responses[responses.length - 1];
            expect(lastResponse.status).toBe(429);
            
            const data = await lastResponse.json();
            expect(data).toHaveProperty('error');
            expect(data.error).toContain('rate limit');
        });
    });
});
