import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import NavBar from './Component/NavBar';
import { css } from '@emotion/css';
import CardAnime from './Component/CardAnime';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import CollectionPage from './Pages/Collections/CollectionPage';
import App from './Pages/App';

const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <div className={css`
  background-color: #131619; /* Light gray background for the website */
  min-height: 100vh;
`}>
  <React.StrictMode>
    <BrowserRouter>
    <NavBar/>
    <ApolloProvider client={client}>
    <App/>
    </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
