import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom

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

interface CollectionDetailProps {
  collections: Collection[];
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
}

const CollectionDetail: React.FC<CollectionDetailProps> = ({ collections, setCollections }) => {
  const navigate = useNavigate();
  const { collectionName } = useParams<{ collectionName: string }>();

  const collection = collections.find((col) => col.name === collectionName);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [animeToRemove, setAnimeToRemove] = useState<AnimeData | null>(null);

  const handleRemoveAnime = (anime: AnimeData) => {
    setAnimeToRemove(anime);
    setShowConfirmation(true);
  };

  const handleConfirmRemove = () => {
    setShowConfirmation(false);
    if (collection && animeToRemove) {
      // Remove the anime with the given ID from the collection
      const updatedCollection: Collection = {
        ...collection,
        animes: collection.animes.filter((anime) => anime.id !== animeToRemove.id),
      };

      setCollections((prevCollections) =>
        prevCollections.map((col) => (col.name === collectionName ? updatedCollection : col))
      );
    }
  };

  const handleCancelRemove = () => {
    setShowConfirmation(false);
    setAnimeToRemove(null);
  };

  const handleEditCollection = () => {
    if (collection) {
      // You can add your edit collection logic here.
      // For example, you can navigate to a separate "Edit Collection" page
      // or show a modal with an edit form for the collection.
      console.log('Edit collection clicked:', collectionName);
    }
  };

  if (!collection) {
    return <div>Collection not found</div>;
  }

  return (
    <div className="container mt-5">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
        <h2>{collection.name}</h2>
        <div>
          <Button variant="primary" onClick={() => handleEditCollection()}>
            Edit Collection
          </Button>{' '}
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>
      <div className="row row-cols-2 row-cols-md-5 g-4">
        {collection.animes.map((anime) => (
          <div className="col" key={anime.id}>
            <Card style={{ backgroundColor: '#0c0e0f', color: '#fff', height: '100%' }}>
              <Link to={`/anime/${anime.id}`}> {/* Add Link to Anime Detail */}
                <Card.Img
                  variant="top"
                  src={anime.coverImage.large}
                  style={{ height: '300px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{anime.title.romaji}</Card.Title>
                  <Button variant="danger" onClick={() => handleRemoveAnime(anime)}>
                    Remove
                  </Button>
                </Card.Body>
              </Link>
            </Card>
          </div>
        ))}
      </div>
      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={handleCancelRemove}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Remove</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {animeToRemove && (
            <p>
              Are you sure you want to remove <strong>{animeToRemove.title.romaji}</strong> from the collection?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelRemove}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmRemove}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CollectionDetail;
