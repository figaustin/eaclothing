import React, { Component, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios'
import LowerNav from './LowerNav';


const Accessories = () => {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const config = {
        headers: {
            "Access-Control-Allow-Origin": "*"
        }

    }

    const goToProductPage = (id) => {
        let path = `/product/${id}`
        navigate(path);
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/products/list/neutral/accessory`, config)
            .then(res => {
                setProducts(res.data);
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    return (
        <div>
            <LowerNav />
            <div className="gender-cover-photo d-flex justify-content-center mx-5">
                <img src={`images/accessoriescover.jpg`} className="img-fluid w-100 px-5" alt="..." />
            </div>
            <div className="d-flex container mx-auto mt-5">

                <div className="mb-5 mx-auto">
                    <div className="row row-cols-3 gap-5 d-flex justify-content-center">
                        {
                            products.map((product, idx) => {
                                return (

                                    <div className="col card w-25 p-0 product-card" key={idx} onClick={() => goToProductPage(product.productId)}>

                                        <div className="">
                                            <img src={`${process.env.REACT_APP_EACLOTHING_IMAGE_URL}${product.productId}`} class="img-fluid" alt="..." />
                                        </div>

                                        <div className="card-body">
                                            <h6 className="card-title">{product.name}</h6>
                                            {

                                                product.salePercentage > 0 ?

                                                    <div className="d-flex gap-2">
                                                        <p className="card-text text-secondary text-decoration-line-through">${product.price}</p>
                                                        <p className="card-text text-danger">$
                                                            {product.afterSalePrice}
                                                        </p>
                                                    </div>


                                                    :

                                                    <p className="card-text text-secondary">${product.price}</p>
                                            }

                                        </div>
                                    </div>

                                )
                            })

                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Accessories;