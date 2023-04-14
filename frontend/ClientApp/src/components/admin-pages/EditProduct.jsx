import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EditProduct = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        Name: "",
        Description: "",
        category: 0,
        gender: 0,
        Price: 0.00,
        image: ""
    })

    const params = useParams();

    const config = {
        headers: {
            'Access-Control-Allow-Origin': 'https://localhost:44400',
            'Content-Type': "multipart/form-data"
        },
        withCredentials: true,
    }

    const getProduct = () => {
        axios.get(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/products/${params.productId}`)
            .then(res => {
                setForm({
                    ProductId: res.data.productId,
                    Name: res.data.name,
                    Description: res.data.description,
                    category: res.data.category,
                    gender: res.data.gender,
                    Price: res.data.price,
                    SalePercentage: res.data.salePercentage
                })
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleFile = (e) => {
        setForm({
            ...form,
            image: e.target.files[0]
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/products/update/${form.ProductId}`, form, config)
            .then(res => {
                console.log(res)
                navigate('/admin/products')
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getProduct();
    }, [])

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="hidden" value={form.ProductId}/>
                <div>
                    <label for="name">Name:</label>
                    <input type="text" onChange={(e) => handleChange(e)} name="Name" id="name" value={form.Name} />
                </div>
                <div>
                    <label for="name">Description:</label>
                    <input type="text" onChange={(e) => handleChange(e)} name="Description" id="description" value={form.Description} />
                </div>
                <div>
                    <label for="name">Category:</label>
                    <input type="number" onChange={(e) => handleChange(e)} name="category" id="category" value={form.category} min={0} max={5} />
                </div>
                <div>
                    <label for="name">Gender</label>
                    <input type="number" onChange={(e) => handleChange(e)} name="gender" id="gender" value={form.gender} min={0} max={2} />
                </div>
                <div>
                    <label for="name">Price: </label>
                    <input type="number" onChange={(e) => handleChange(e)} name="Price" id="price" value={form.Price} step={0.01} />
                </div>
                <div>
                    <label for="sale">Sale %: </label>
                    <input type="number" onChange={(e) => handleChange(e)} name="SalePercentage" id="sale" value={form.SalePercentage} step={1} />
                </div>

                <div>
                    <label for="image">Image:</label>
                    <input type="file" onChange={(e) => handleFile(e)} id="image" value={form.Image} />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default EditProduct;