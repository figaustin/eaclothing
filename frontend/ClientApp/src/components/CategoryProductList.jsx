import React, { Component, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios'
import CategoryBar from './CategoryBar'
import '.././custom.css'
import LowerNav from './LowerNav';

const CategoryProductList = (props) => {
    const [products, setProducts] = useState([]);

    const params = useParams();

    const navigate = useNavigate();

    const genderIds = {
        neutral: 0,
        men: 1,
        women: 2,
    }

    const categoryIds = {
        hats: 0,
        jackets: 1,
        tops: 2,
        bottoms: 3,
        shoes: 4,
        accessories: 5
    }

    const config = {
        headers: {

        }

    }

    const goToProductPage = (id) => {
        let path = `/product/${id}`
        navigate(path);
    }

    const loadProducts = () => {
        axios.get(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/products/list/${genderIds[params.gender]}/${categoryIds[params.category]}`, config)
            .then(res => {
                setProducts(res.data)
            })
            .catch(err => { console.log(err) })
    }



    useEffect(() => {
        loadProducts();

    }, [params])

    return (
        <div>
            <LowerNav />
            <div className="gender-cover-photo d-flex justify-content-center mx-5">
                <img src={`images/${params.gender}scover.jpg`} className="img-fluid w-100 px-5" alt="..." />
            </div>
            <div >
                {
                    products.length === 0 ? <p className="fs-1 mx-auto mb-5">There is nothing here.</p>
                        :
                        <div className="d-flex products-container mx-auto mt-5">
                            <CategoryBar gender={params.gender} />
                            <div className="mb-5">
                                <div className="row row-cols-3 gap-5 d-flex justify-content-center">
                                    {

                                        products.map((product, idx) => {
                                            return (

                                                <div className="col card w-25 p-0 product-card" key={idx} onClick={() => goToProductPage(product.productId)}>

                                                    <div className="">
                                                    <img src={`${process.env.REACT_APP_EACLOTHING_IMAGE_URL}${product.productId}`} class="img-fluid" alt="..." />                                                    </div>

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
                }

            </div>
        </div>
    )
}

export default CategoryProductList;