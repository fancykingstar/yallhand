import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export const LazyImg = (props) => (
    <LazyLoadImage
      alt={props.alt}
      effect="blur"
      height={props.height}
      width={props.width}
      src={props.src}
      style={props.style}
      />
  );
  