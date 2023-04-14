import React, { Component, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import CategoryBar from './CategoryBar';
import '.././custom.css';
import LowerNav from './LowerNav';

const NoCategoryProductList = (props) => {
    const [products, setProducts] = useState([]);

    const genderParam = useParams();

    const navigate = useNavigate();

    const genderIds = {
        neutral : 0,
        men : 1,
        women: 2,
    }

    const config = {
        headers: {

        }

    }

    const loadGenderProducts = () => {
        axios.get(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/products/list/${genderIds[genderParam.gender]}`, config)
            .then(res => {
                setProducts(res.data)
            })
            .catch(err => { console.log(err) })
    }

    const goToProductPage = (id) => {
        let path = `/product/${id}`
        navigate(path);
    }

    useEffect(() => {
        loadGenderProducts();

        }, [genderParam])

    return (
        <div>
            <LowerNav/>
            <div className="gender-cover-photo d-flex justify-content-center mx-5">
                <img src={`images/${genderParam.gender}scover.jpg`} className="img-fluid w-100 px-5" alt="..."/>
            </div>
            <div className="d-flex products-container mx-auto mt-5">
                <CategoryBar gender={genderParam.gender} />
                <div className="mb-5">
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

export default NoCategoryProductList;
