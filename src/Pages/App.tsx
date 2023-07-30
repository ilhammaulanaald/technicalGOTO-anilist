import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import CollectionPage from './Collections/CollectionPage';
import CardAnime, { AnimeData } from '../Component/CardAnime'; // Import AnimeData from CardAnime
import AnimeDetailWrapper from './AnimeDetailWrapper';
import CollectionDetail from './Collections/CollectionDetail';

interface Collection {
  name: string;
  animes: AnimeData[]; // Use AnimeData from the imported CardAnime
}

const App: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>(() => {
    const storedCollections = localStorage.getItem('collections');
    return storedCollections ? JSON.parse(storedCollections) : [];
  });

  useEffect(() => {
    localStorage.setItem('collections', JSON.stringify(collections));
  }, [collections]);

  return (
    <>
      <Routes>
        <Route path='/' element={<CardAnime />} />
        <Route path='/collection' element={<CollectionPage />} />
        <Route path="/anime/:animeId" element={<AnimeDetailWrapper />} />
        <Route
          path="/collectiondetail/:collectionName"
          element={<CollectionDetail collections={collections} setCollections={setCollections} />}
        />
      </Routes>
    </>
  );
}

export default App;
