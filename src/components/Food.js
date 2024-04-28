// src/Food.js
import React from 'react';

const Food = ({ foodCell }) => {
    return (
        <div
            style={{
                left: `${foodCell[0]}%`,
                top: `${foodCell[1]}%`,
            }}
            className="food"
        ></div>
    );
};

export default Food;
