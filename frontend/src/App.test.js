import { render, screen } from '@testing-library/react';
import App from './App';

test('Renders Todo List Title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Todo List/i);
  expect(linkElement).toBeInTheDocument();
});

test('Renders Task Counter', async() => {
  render(<App />);
  expect(await screen.getByText(/You have/i)).toBeInTheDocument();
});

test('Renders Submit Form', () => {
  render(<App />);
  const linkElement = screen.getAllByPlaceholderText(/Enter item/i);
  expect(linkElement).toBeTruthy();
});

test('Renders Submit Button', () => {
  render(<App />);
  const linkElement = screen.getByText(/Submit/i);
  expect(linkElement).toBeTruthy();
});
