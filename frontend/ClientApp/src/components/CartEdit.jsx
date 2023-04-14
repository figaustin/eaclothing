import React, { useState, useEffect } from 'react';

const CartEdit = (props) => {

    return (
        <div>
            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasExampleLabel">Edit Cart Item</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    {
                        props.edit.name != null ?

                            <p>{props.edit.name}</p>

                            :

                            <></>
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default CartEdit;