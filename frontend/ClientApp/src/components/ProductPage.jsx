import React, { Component, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios'
import '.././custom.css'
import LowerNav from './LowerNav';

const ProductPage = (props) => {
    const [product, setProduct] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState("Size")

    const FormData = require('form-data');

    const params = useParams();

    const navigate = useNavigate();

    const config = {
        headers: {

        },
        withCredentials: true,

    }

    const loadProduct = () => {
        axios.get(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/products/${params.productId}`, config)
            .then(res => {
                setProduct(res.data)
            })
            .catch(err => { console.log(err) })
    }

    const changeSize = (size) => {
        setSize(size)
    }

    const increaseQuantity = () => {
        if (quantity === 5) return;
        setQuantity(quantity + 1);
    }

    const decreaseQuantity = () => {

        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
        
    }

    const addToCart = () => {

        if (size === "Size") {
            alert('Please specify the size!')
            return;
        }
    
        let formData = new FormData();

        formData.append('Quantity', quantity);
        formData.append('size', size);

        axios.post(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/usercart/add/${params.productId}`, formData, config)
            .then(res => { navigate('/cart') })
            .catch(error => {
                console.log(error)
                alert('This item is already in your cart! You can ')
            })

    }



    useEffect(() => {
        loadProduct();

    }, [])

    return (
        <div>   
            <LowerNav />
            <div className="container-fluid mt-3 w-75 mx-auto">
                <div className="d-flex flex-lg-nowrap flex-wrap gap-5">

                
                    <div className="">
                        <img src={`${process.env.REACT_APP_EACLOTHING_IMAGE_URL}${product.productId}`} class="img-fluid" alt="..." />
                    </div>

                    <div className="w-75">
                        <div className="row border-bottom pb-5">
                            <h4 className="col text-wrap"> {product.name} </h4>
                        </div>

                        <div className="mt-4 row d-flex flex-column border-bottom">
                            
                            <button class="btn text-start fs-5 d-flex justify-content-between px-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                <p>
                                    Details 
                                </p>
                                <p> + </p>
                            </button>
                            <div class="collapse" id="collapseExample">
                                <div class="card card-body">
                                    {product.description}
                                </div>
                            </div>
                            <p className="col col-lg-6 w-100 text-center text-wrap text-break"></p>
                        </div>
                    
                        <div className="mt-4 row border-bottom pb-2">
                            <p className="col col-lg-3 fs-5">Price: </p>
                            {
                                product.salePercentage > 0 ?

                                    
                                    <div className="d-flex gap-2">
                                        <p className="fs-5 text-primary text-decoration-line-through">${product.price}</p>
                                        <p className="fs-5 text-danger">$
                                            {product.afterSalePrice}
                                        </p>
                                    </div>
                                    :
                                    <p className="col col-lg-6 text-primary text-start fs-5">${product.price}</p>

                            }
                        </div>

                        <div className="mt-5 d-flex justify-content-between">
                            <div className="dropdown">
                                <button className="btn border dropdown-toggle px-5" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {size} 
                                </button>
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
                            
                                <p className="text-center mb-0 fs-5">{quantity}</p>
                            
                                <button className="btn" onClick={() => {increaseQuantity() } }> + </button>
                            </div>
                        </div>
                    
                        <div className="d-flex justify-content-center mt-5 mb-5">
                            <button className="btn btn-secondary rounded-pill px-5 fs-5" onClick={() => {addToCart()} }>Add To Cart</button>
                        </div>
                </div>
                
                </div>
            </div>
            
        </div>
    )
}

export default ProductPage;