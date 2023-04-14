import React, { Component, useState } from 'react';
import { NavItem, NavLink, Carousel, CarouselItem, UncontrolledCarousel } from 'reactstrap';
import { Link } from 'react-router-dom';
import '.././custom.css'

const LowerNav = () => {

    return (
        <>
            <div className="d-flex justify-content-center">
                <a className="text-center fs-2 text-decoration-none text-dark" href="/">E&A Clothing</a>
            </div>
        
            <div className="navbar-expand-sm navbar-toggleable-sm ng-white d-flex justify-content-center">
                <div className="container w-25 text-center">
                    <div className="row">
                        <div className="col">
                            <NavItem className="list-unstyled">
                                <NavLink tag={Link} className="text-dark maintext list-unstyled" to="/men">Men</NavLink>
                            </NavItem>
                        </div>
                        <div className="col">
                            <NavItem className="list-unstyled">
                                <NavLink tag={Link} className="text-dark maintext" to="/women">Women</NavLink>
                            </NavItem>
                        </div>
                        <div className="col">
                            <NavItem className="list-unstyled">
                                <NavLink tag={Link} className="text-dark maintext" to="/accessories">Accessories</NavLink>
                            </NavItem>
                        </div>
                        <div className="col">
                            <NavItem className="list-unstyled">
                                <NavLink tag={Link} className="text-dark maintext" to="/sales">Sales</NavLink>
                            </NavItem>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default LowerNav;