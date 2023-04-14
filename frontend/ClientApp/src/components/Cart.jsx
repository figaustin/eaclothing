import React, { Component, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios'
import '.././custom.css'
import LowerNav from './LowerNav';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


const Cart = (props) => {

    const navigate = useNavigate();

    const [cart, setCart] = useState(null);

    const [cartLoaded, setCartLoaded] = useState(false);

    const [total, setTotal] = useState(0);

    const [editItem, setEditItem] = useState({});



    const config = {
        headers: {
        },
        withCredentials: true

    }

    const loadCart = () => {
        axios.get(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/usercart/view`, config)
            .then(res => {
                if (res.data.length > 0) {
                    setCart(res.data)
                    setCartLoaded(true);
                }
            })
            .catch(err => { console.log(err) })
    }

    const parseSize = (size) => {
        const sizeArr = ["S", "M", "L", "XL", "XXL"];

        return (
            <p className="text-secondary fs-6">{sizeArr[size]}</p>
        );
    }

    const loadTotal = () => {

        if (!cartLoaded) return;

        setTotal(cart[0].total)
    }

    const removeFromCart = (productId) => {

        axios.delete(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/usercart/remove/${productId}`, config)
            .then(res => {
                loadCart();
                
            })
            .catch(error => {
                console.log(error);
            })
    }

    const changeSize = (size) => {
        setEditItem({
            ...editItem,
            size: size
        })
    }

    const increaseQuantity = () => {
        if (editItem.quantity === 5) return;
        setEditItem({
            ...editItem,
            quantity: editItem.quantity + 1,
        });
    }

    const decreaseQuantity = () => {

        
        if (editItem.quantity > 1) { 
            setEditItem({
                ...editItem,
                quantity: editItem.quantity - 1,
            });
        }
    }

    const sendEdit = () => {

        axios.put(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/usercart/edit/${editItem.product.productId}`, editItem, config)
            .then(res => {
                loadCart();
            })
            .catch(error => {
                console.log(error);
            })
    }


    useEffect(() => {
        loadCart();

    }, [])

    useEffect(() => {
        loadTotal();

    }, [cartLoaded])

    useEffect(() => {

        if (!cartLoaded) return;

        loadTotal();

    }, [cart])

    return (
        <div>
            <LowerNav />
            <div className="container mt-3 w-75 row mx-auto">
                <div className="col d-flex flex-column gap-3">

                
                    {
                        cart === null ? "" : 
                        
                    
                            cart[0].productsInCarts.map((item, idx) => {
                                return (
                                    <div className="" key={idx}>
                                        <div className="d-flex gap-3">
                                            <div className="w-50">
                                            <img src={`${process.env.REACT_APP_EACLOTHING_IMAGE_URL}${item.product.productId}`} class="img-fluid" alt="..." />                                            </div>
                                            
                                            <div className="container d-flex flex-column w-75">
                                                <div className="d-flex">
                                                    <a className="fs-5 text-black cart-link" href={`/product/${item.product.productId}`}>{item.product.name}</a>
                                                    
                                                </div>
                                                
                                                {
                                                    item.product.salePercentage > 0 ?


                                                        <div className="d-flex gap-3">
                                                            <p className="text-primary fs-5 text-decoration-line-through">${item.product.price}</p>
                                                            <p className="fs-5 text-danger">$
                                                                {item.product.afterSalePrice}
                                                            </p>
                                                        </div>
                                                        :
                                                        <p className="text-primary fs-5 flex-fill">${item.product.price}</p>

                                                }
                                                <div>
                                                    <p className="text-secondary fs-6 d-flex gap-1">Size:{parseSize(item.size)} </p>
                                                </div>
                                                <p className="text-secondary fs-6 text-nowrap flex-fill">Quantity: {item.quantity}</p>
                                                <div className="d-flex gap-3 flex-fill">
                                                    <p type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample" onClick={() => setEditItem(item) }>Edit</p>
                                                    <p type="button" onClick={() => {removeFromCart(item.product.productId) } }>Remove</p>
                                                </div>
                                            </div>
                                        
                                        </div>
                                    </div>
                                )
                            })

                    
                      }
                </div>
                <div className="col-lg-5">
                    <p className="border-bottom fs-3 px-2">Order Summary</p>
                    <p className="text-secondary fs-6">Merchandise Value: ${total}</p>
                    <p className="text-secondary fs-6">Shipping: $5.00</p>
                    <p className="fs-5 text-secondary border-bottom">Total: ${total + 5.00} </p>
                    <div className="d-flex justify-content-center">
                        <a href="/checkout" type="button" className="btn btn-secondary rounded-pill">Proceed To Checkout</a>
                    </div>
                    
                </div>
                
            </div>




            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasExampleLabel">Edit Cart Item</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    {
                        editItem.product != null ?

                            <p>{editItem.product.name}</p>

                            :

                            <></>
                    }

                    <div className="mt-5 d-flex justify-content-between">
                        <div className="dropdown">
                            {
                                isNaN(editItem.size) ?

                                <button className="btn border dropdown-toggle px-5" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {editItem.size}
                                    </button>
                                    :
                                    <button className="btn border dropdown-toggle px-5" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {parseSize(editItem.size)}
                                    </button>
                            }
                            
                            <ul class="dropdown-menu">
                                <li><button class="dropdown-item text-center" type="button" onClick={() => { changeSize("S") }}>S</button></li>
                                <li><button class="dropdown-item text-center" type="button" onClick={() => { changeSize("M") }}>M</button></li>
                                <li><button class="dropdown-item text-center" type="button" onClick={() => { changeSize("L") }}>L</button></li>
                                <li><button class="dropdown-item text-center" type="button" onClick={() => { changeSize("XL") }}>XL</button></li>
                                <li><button class="dropdown-item text-center" type="button" onClick={() => { changeSize("XXL") }}>XXL</button></li>
                            </ul>
                        </div>

                        <div className="border rounded d-flex">
                            <button className="btn" onClick={() => { decreaseQuantity() }}> - </button>

                            <p className="text-center mb-0 fs-5">{editItem.quantity}</p>

                            <button className="btn" onClick={() => { increaseQuantity() }}> + </button>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center">
                        <button type="button" className="btn btn-secondary rounded-pill" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample" onClick={() => sendEdit() }>Save</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Cart;