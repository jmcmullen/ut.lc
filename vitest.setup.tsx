import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to} data-testid="router-link">
      {children}
    </a>
  ),
}))