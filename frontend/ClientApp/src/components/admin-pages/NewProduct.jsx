import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewProduct = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        Name: "",
        Description: "",
        category: 0,
        gender: 0,
        Price: 0.00,
        image: "",
    })
   
    const config = {
        headers: {
            'Content-Type': "multipart/form-data"
        },
        withCredentials: true,
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

        axios.post(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/products/create`, form, config)
            .then(res => {
                console.log(res)
                navigate('/admin/products')
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
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
                    <label for="name">Price:</label>
                    <input type="number" onChange={(e) => handleChange(e)} name="Price" id="price" value={form.Price} step={0.01} />
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

export default NewProduct;
