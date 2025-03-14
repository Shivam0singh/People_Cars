import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import Home from './screens/Home';
import PersonDetails from './screens/PersonDetails';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/people/:id" element={<PersonDetails />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;