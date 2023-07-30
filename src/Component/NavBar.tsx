import React from 'react';
import { Navbar, Nav, Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { css } from '@emotion/css';
import { Link, useLocation } from 'react-router-dom';

const NavBar: React.FC = () => {
  const location = useLocation();

  const cardLinkStyles = css`
    background-color: #0c0e0f; /* Black card background */
    color: #fff; /* White text color */
    padding: 20px;
    margin-top: -18px;
    border-top-left-radius: 0; 
    border-top-right-radius: 0; 
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    width: 100%;

    .nav-link {
      position: relative;
      color: #fff;
      text-decoration: none;
      transition: color 0.3s;
      display: block; /* Add display block to the nav-link to take full width */
    }

    .nav-link::before {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0; /* Set left to 0 to start the underline from the beginning */
      width: 100%; /* Set width to 100% to span the entire width of the Col */
      height: 2px;
      background-color: #B6F09C; /* Underline color */
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s;
    }

    .nav-link:hover,
    .nav-link:focus {
      color: #fff;
    }

    .nav-link.active::before {
      transform: scaleX(1);
    }
  `;

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Col
        sm={9} /* Main content width on small screens */
        md={10} /* Main content width on medium screens */
        className={css`
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        `}
      >
        <Card className={css`
          background-color: #0c0e0f; /* Black card background */
          color: #fff; /* White text color */
          padding: 20px;
          border-bottom-left-radius: 0; 
          border-bottom-right-radius: 0; 
          border-top-left-radius: 30px;
          border-top-right-radius: 30px;
          width: 100%;
        `}>
          <Card.Title>AniList</Card.Title>
          <Row>
            <Col><Card.Text>One Stop Anime Solution</Card.Text></Col>
          </Row>
        </Card>

        <Card className={cardLinkStyles}>
          <div className="d-flex justify-content-around">
            <Row>
              <Col>
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
              </Col>
              <Col>
                <Link to="/collection" className={`nav-link ${location.pathname === '/collection' ? 'active' : ''}`}>Collection</Link>
              </Col>
            </Row>
          </div>
        </Card>
      </Col>
    </div>
  );
};

export default NavBar;
