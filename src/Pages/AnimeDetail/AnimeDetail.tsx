import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { jsx, css } from '@emotion/react'; // Import jsx from @emotion/react

interface AnimeDetailProps {
  animeId: number;
}

const GET_ANIME_BY_ID = gql`
  query getAnimeById($animeId: Int!) {
    Media(id: $animeId, type: ANIME) {
      id
      title {
        romaji
      }
      coverImage {
        large
      }
      bannerImage
      description
      episodes
      genres
      averageScore
    }
  }
`;

const AnimeDetail: React.FC<AnimeDetailProps> = ({ animeId }) => {
  const { loading, error, data } = useQuery(GET_ANIME_BY_ID, {
    variables: { animeId },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const animeData = data?.Media;

  if (!animeData) {
    return <div>Anime not found.</div>;
  }

  return (
    <div className="container mt-5">
      {jsx(
        // Use jsx function here
        'div',
        {
          css: css`
            position: relative;
          `,
        },
        <>
          {jsx(
            // Use jsx function here
            'img',
            {
              src: animeData.bannerImage, // Set the source of the image
              alt: 'Banner', // Provide an alternative text for the image
              css: css`
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 250px; /* Set the height of the banner image */
                z-index: -1;
              `,
            }
          )}
          <Card className="m-4">
            <Card.Img
              variant="top"
              src={animeData.coverImage.large}
              alt={animeData.title.romaji}
            />
            <Card.Body>
              <Card.Title>{animeData.title.romaji}</Card.Title>
              <Card.Text>{animeData.description}</Card.Text>
              <div>
                <strong>Number of Episodes: </strong> {animeData.episodes}
              </div>
              <div>
                <strong>Genres: </strong>
                {animeData.genres.map((genre: string) => (
                  <Badge key={genre} className="m-1">
                    {genre}
                  </Badge>
                ))}
              </div>
              <div>
                <strong>Rating: </strong> {animeData.averageScore}
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default AnimeDetail;
