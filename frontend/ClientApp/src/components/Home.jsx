import React, { Component, useState } from 'react';
import { NavItem, NavLink, Carousel, CarouselItem, UncontrolledCarousel } from 'reactstrap';
import { Link } from 'react-router-dom';
import '.././custom.css'
import LowerNav from './LowerNav';

const items = [
    {
        src: 'images/carousel4.jpg',
        altText: 'Slide',
        key: 1,
    },
    {
        src: 'images/carousel3.jpg',
        altText: 'Slide',
        key: 2,
    },
    {
        src: 'images/carousel1.jpg',
        altText: 'Slide',
        key: 3,
    },
];

const Home = ()  => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    };

    const slides = items.map((item) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.key}
            >
                <img src={item.src} alt={item.altText} className="img-fluid" />
            </CarouselItem>
        );
    });

    return (
      <div>

            <LowerNav></LowerNav>
            <div className="container-fluid p-0 d-flex position-relative justify-content-center">
                
                <UncontrolledCarousel
                    items={items}/>

                <div className="position-absolute fw-bold top-50">
                    <p className="text-white fw-bolder fs-1">Expand Your Style</p>
                    <div className="d-flex justify-content-center gap-3">
                        <button type="button" className="btn btn-warning fs-6 rounded-pill p-2"><a href="/men" className="nav-link text-white">&nbsp; Shop Men &nbsp;</a></button>
                        <button type="button" className="btn btn-warning fs-6 rounded-pill"><a href="/women" className="nav-link text-white">Shop Women</a></button>
                    </div>
                    
                </div>
                
            </div>
            
    
      </div>
    );
  }


export default Home;
