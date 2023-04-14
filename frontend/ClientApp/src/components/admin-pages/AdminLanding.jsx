import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminLanding = () => {

    const [products, setProducts] = useState([])

    const getProducts = () => {
        axios.get(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/products`)
            .then(res => {
                setProducts(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const removeProduct = (productId) => {
        axios.delete(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/products/delete/${productId}`)
            .then(res => {
                getProducts();
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getProducts();
    },[])

    return (
        <div className="container mx-auto d-flex flex-column">
            <h1>Products List</h1>
            <a href="/admin/products/create">Create a new product</a>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Category</th>
                    <th>Base Price</th>
                    <th>Sale %</th>
                    <th>After Price</th>
                    <th> </th>
                </tr>
                {
                    products.map((product, idx) => {
                        return (
                            <tr key={idx}>
                                <td className="text-wrap"><a href={`/product/${product.productId}`}>{product.name}</a></td>
                                <td>{product.gender}</td>
                                <td>{product.category}</td>
                                <td>{product.price}</td>
                                <td>{product.salePercentage}</td>
                                <td>{product.afterSalePrice}</td>
                                <td>
                                    <a href={`/admin/products/edit/${product.productId}`} className="btn">Edit</a>
                                    <button type="button" onClick={() => removeProduct(product.productId)} className="btn">Delete</button>
                                </td>
                            </tr>
                        )
                    })
                }
            </table>
        </div>
    )
}

export default AdminLanding;