import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import axios from 'axios';

import AddressForm from './AddressForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

const Checkout = (props) => {
    const [clientSecret, setClientSecret] = useState("");

    const [total, setTotal] = useState(0.00);
    const [shippingFormFilled, setShippingFormFilled] = useState(false);
    const [shippingForm, setShippingForm] = useState({
        Address: "",
        City: "",
        Region: "",
        PostalCode: "",
        Country: "",
        Phone: "",
        StripePaymentId: "",
    })

    const handleChange = (e) => {

        setShippingForm({
            ...shippingForm,
            [e.target.name]: e.target.value
        })
    }

    const config = {
        headers: {

        },
        withCredentials: true,
    }

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        axios.post(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/orders/payment/create`, {}, config)
            .then(res => {
                console.log(res)
                setClientSecret(res.data.client_secret)
                setShippingForm({
                    ...shippingForm,
                    StripePaymentId: res.data.id
                })
            })
            .catch(error => {console.log(error) })

        
    }, []);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/usercart/view`, config)
            .then(res => {
                setTotal(res.data[0].total)
                console.log(res)
            })
    },[])

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div>
            <div className="container mx-auto w-50">
                <div>
                    <p className="border-bottom fs-3 px-2">Order Summary</p>
                    <p className="text-secondary fs-6">Merchandise Value: ${total}</p>
                    <p className="text-secondary fs-6">Shipping: $5.00</p>
                    <p className="fs-5 text-secondary border-bottom">Total: ${total + 5.00} </p>
                </div>
                {
                    clientSecret && (
                        <Elements options={options} stripe={stripePromise}>
                            <AddressForm />
                            <CheckoutForm shippingFormFilled={shippingFormFilled} shippingForm={shippingForm} />
                        </Elements>
                    )
                }
            </div>
            
        </div>
    )
}

export default Checkout;