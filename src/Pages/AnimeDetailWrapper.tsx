// components/AnimeDetailWrapper.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import AnimeDetail from './AnimeDetail/AnimeDetail';

const AnimeDetailWrapper: React.FC = () => {
  const { animeId } = useParams<{ animeId: string }>();

  // Check if animeId is defined before parsing
  const parsedAnimeId = animeId ? parseInt(animeId, 10) : 0;

  return <AnimeDetail animeId={parsedAnimeId} />;
};

export default AnimeDetailWrapper;
