import React from "react";
import Star from '../Assets/Icons/star.svg';




const retrieve = {
    "Star":Star,

}

export const getIcon = (val) => retrieve[val];
