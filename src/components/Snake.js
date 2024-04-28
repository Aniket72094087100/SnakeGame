// src/Snake.js
import React from 'react';

const Snake = ({ snakeCells }) => {
    return (
        <div>
            {snakeCells.map((cell, index) => (
                <div
                    key={index}
                    style={{
                        left: `${cell[0]}%`,
                        top: `${cell[1]}%`,
                    }}
                    className="snake"
                ></div>
            ))}
        </div>
    );
};

export default Snake;
