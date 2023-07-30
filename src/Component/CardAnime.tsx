import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, ListGroup, Pagination, Badge } from 'react-bootstrap';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

export interface AnimeData {
  id: number;
  title: {
    romaji: string;
  };
  coverImage: {
    large: string;
  };
}

const GET_ANIME_DATA = gql`
  query ($perPage: Int) {
    Page(perPage: $perPage) {
      media(type: ANIME, sort: TRENDING_DESC) {
        id
        title {
          romaji
        }
        coverImage {
          large
        }
      }
    }
  }
`;

interface Collection {
  name: string;
  animes: AnimeData[];
}

const CardAnime: React.FC = () => {
  const { loading, error, data } = useQuery<{ Page: { media: AnimeData[] } }>(GET_ANIME_DATA, {
    variables: { perPage: 100 },
  });

  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collections, setCollections] = useState<Collection[]>(() => {
    const storedCollections = localStorage.getItem('collections');
    return storedCollections ? JSON.parse(storedCollections) : [];
  });

  useEffect(() => {
    localStorage.setItem('collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    if (data && data.Page) {
      setAnimeList(data.Page.media);
    }
  }, [data]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setTotalPages(Math.ceil(animeList.length / 10));
  }, [animeList]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleAddToCollection = (anime: AnimeData) => {
    setSelectedCollection(null); // Reset selectedCollection state to show the "Add New Collection" option
    setCollectionName(''); // Reset the new collection name when "Add New Collection" is selected
    setSelectedAnime(anime); // Set the currently selected anime when adding it to a collection
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCollectionName('');
    setSelectedCollection(null);
    setSelectedAnime(null);
  };

  const handleSubmitCollection = () => {
    if (!selectedAnime) {
      // No anime selected, do nothing
      return;
    }

    if (selectedCollection) {
      // If an existing collection is selected, add the selected anime to it
      if (!isAnimeInCollection(selectedCollection, selectedAnime)) {
        const updatedCollection: Collection = {
          ...selectedCollection,
          animes: [...selectedCollection.animes, selectedAnime],
        };

        setCollections((prevCollections) =>
          prevCollections.map((collection) =>
            collection.name === selectedCollection.name ? updatedCollection : collection
          )
        );
      }
    } else {
      // If no collection is selected, create a new collection with the entered name
      if (collectionName.trim() === '') {
        alert('Please enter a collection name.');
        return;
      }

      // Check if the collection name contains special characters
      if (/[^a-zA-Z0-9 ]/.test(collectionName)) {
        alert('Collection name cannot contain special characters.');
        return;
      }

      const newCollection: Collection = {
        name: collectionName,
        animes: [selectedAnime],
      };

      setCollections((prevCollections) => [...prevCollections, newCollection]);
    }

    handleCloseModal();
  };

  const handleRemoveFromCollection = (collectionName: string) => {
    setCollections((prevCollections) =>
      prevCollections.filter((collection) => collection.name !== collectionName)
    );
  };

  const handleSelectCollection = (selected: string) => {
    if (selected === 'new') {
      setSelectedCollection(null);
      setCollectionName(''); // Reset the new collection name when "Add New Collection" is selected
    } else {
      const collection = collections.find((collection) => collection.name === selected);
      setSelectedCollection(collection || null);
      setCollectionName(''); // Reset the new collection name when an existing collection is selected
    }
  };

  const [selectedAnime, setSelectedAnime] = useState<AnimeData | null>(null);

  const isAnimeInCollection = (collection: Collection, anime: AnimeData) => {
    return collection.animes.some((a) => a.id === anime.id);
  };

  return (
    <div className="container mt-5">
      <div className="row row-cols-2 row-cols-md-5 g-4">
        {/* Display anime for the current page */}
        {animeList.slice((currentPage - 1) * 10, currentPage * 10).map((anime) => (
          <div className="col" key={anime.id}>
            <Card style={{ backgroundColor: '#0c0e0f', color: '#fff', height: '100%', position: 'relative' }}>
              <Card.Img
                variant="top"
                src={anime.coverImage.large}
                style={{ height: '300px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Link to={`/anime/${anime.id}`}> {/* Move the Link here */}
                  <Card.Title style={{ marginBottom: '20px' }}>{anime.title.romaji}</Card.Title>
                </Link>
                <div style={{ position: 'absolute', bottom: 0, right: 0, padding: '10px' }}>
                  <Button variant="primary" onClick={() => handleAddToCollection(anime)}>
                    +
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        {/* Use the container to center the pagination */}
        <div className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev onClick={handlePrevPage} disabled={currentPage === 1} />
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      </div>
      {/* Modal component */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCollection ? 'Edit Collection' : 'Add to Collection'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="collectionSelect">
            <Form.Label>Or Select Existing Collection</Form.Label>
            <Form.Control
              as="select"
              value={selectedCollection ? selectedCollection.name : 'new'}
              onChange={(e) => handleSelectCollection(e.target.value)}
            >
              <option value="new">Add New Collection</option>
              {collections.map((collection) => (
                <option key={collection.name} value={collection.name}>
                  {collection.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {selectedCollection ? (
            <>
              <ListGroup>
                {selectedCollection.animes.map((anime) => (
                  <ListGroup.Item key={anime.id}>
                    {anime.title.romaji}{' '}
                    {selectedAnime && isAnimeInCollection(selectedCollection, selectedAnime) && (
                      <Badge>Added</Badge>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        setSelectedCollection((prev) => ({
                          ...prev!,
                          animes: prev!.animes.filter((a) => a.id !== anime.id),
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          ) : (
            <>
              <Form.Group controlId="newCollectionName">
                <Form.Label>New Collection Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter new collection name"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                />
              </Form.Group>

              <ListGroup>
                {collections.map((collection) => (
                  <ListGroup.Item key={collection.name}>
                    {collection.name}{' '}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveFromCollection(collection.name)}
                    >
                      Remove
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitCollection}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CardAnime;
