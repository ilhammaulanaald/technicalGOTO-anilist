import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface AnimeData {
  id: number;
  title: {
    romaji: string;
  };
  coverImage: {
    large: string;
  };
}

interface Collection {
  name: string;
  animes: AnimeData[];
}

const CollectionPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>(() => {
    // Retrieve collections from local storage when the component is mounted
    const storedCollections = localStorage.getItem('collections');
    return storedCollections ? JSON.parse(storedCollections) : [];
  });

  useEffect(() => {
    // Save collections to local storage whenever it changes
    localStorage.setItem('collections', JSON.stringify(collections));
  }, [collections]);

  return (
    <div className="container mt-5">
      {collections.map((collection) => (
        <div key={collection.name}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
            <h2>{collection.name}</h2>
            <Link to={`/collectiondetail/${collection.name}`}>
              <Button variant="primary">Edit Collection</Button>
            </Link>
          </div>
          <div className="row row-cols-2 row-cols-md-5 g-4">
          {collection.animes.map((anime) => (
  <div className="col" key={anime.id}>
    <Card style={{ backgroundColor: '#0c0e0f', color: '#fff', height: '100%' }}>
      <Card.Img
        variant="top"
        src={anime.coverImage.large}
        style={{ height: '300px', objectFit: 'cover' }}
      />
      <Link to={`/anime/${anime.id}`}>
        <Card.Body>
          <Card.Title>{anime.title.romaji}</Card.Title>
        </Card.Body>
      </Link>
    </Card>
  </div>
))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollectionPage;
