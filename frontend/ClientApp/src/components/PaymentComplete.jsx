import React, { useState, useEffect } from "react";
import axios from 'axios';

const PaymentComplete = () => {


    const config = {
        headers: {

        },
        withCredentials: true

    }

    useEffect(() => {
        axios.post(`${process.env.REACT_APP_EACLOTHING_API_URL}/api/orders/payment/complete`, {}, config)
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            })
    },[])


    return (
        <div>
            <p>Thanks for completing your order! Your item(s) will be shipped soon...</p>
        </div>
    )
}

export default PaymentComplete;