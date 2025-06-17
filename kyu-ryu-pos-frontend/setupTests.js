import '@testing-library/jest-dom/extend-expect';

// Mock react-router-dom for tests
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: () => <div />,
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/' }),
    useParams: () => ({}),
  };
});
