import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        env: {
            NODE_ENV: 'test',
            DATABASE_URL: 'postgresql://localhost:5432/biglittle_test',
            JWT_SECRET: 'test-only-secret-that-is-at-least-32-chars',
            JWT_EXPIRES_IN: '1h',
        },
        setupFiles: ['./tests/setup.ts'],
        fileParallelism: false,
        include: ['tests/**/*.test.ts'],
    },
});
