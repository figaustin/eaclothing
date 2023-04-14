import React, { Component, useState } from 'react';

const CategoryBar = props => {


    return (
        <div className="container d-flex flex-column me-5">
            
            <a href={`/${props.gender}/hats`} className="text-dark text-decoration-none fs-5 fw-semibold py-3 border-bottom">Hats</a>
            <a href={`/${props.gender}/jackets`} className="text-dark text-decoration-none fs-5 fw-semibold py-3 border-bottom">Jackets</a>
            <a href={`/${props.gender}/tops`} className="text-dark text-decoration-none fs-5 fw-semibold py-3 border-bottom">Tops</a>
            <a href={`/${props.gender}/bottoms`} className="text-dark text-decoration-none fs-5 fw-semibold py-3 border-bottom">Bottoms</a>
            <a href={`/${props.gender}/shoes`} className="text-dark text-decoration-none fs-5 fw-semibold py-3 border-bottom">Shoes</a>

        </div>
    )
}

export default CategoryBar;