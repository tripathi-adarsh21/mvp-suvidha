import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SUVIDHA welcome screen', () => {
  render(<App />);
  const heading = screen.getByText(/SUVIDHA/i);
  expect(heading).toBeInTheDocument();
});
