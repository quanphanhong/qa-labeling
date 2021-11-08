import { render, screen } from '@testing-library/react';
import QAList from './qaList';

test('renders learn react link', () => {
  render(<QAList />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
