import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders saga dashboard header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Saga Microservices Dashboard/i);
  expect(headerElement).toBeInTheDocument();
});
