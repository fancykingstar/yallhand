import React from 'react';

export class Desert extends React.Component {
    render() {
        // const qwidth = this.props.width === undefined? "16px" :this.props.width
        // const qheight = this.props.height === undefined? "27px" :this.props.height
        // const styleName = this.props.style === undefined? "QuadranceLogo" : this.props.style
        // const qfill = this.props.fill === undefined? "#1E7895" : this.props.fill
        return (
        <div >
        <svg 
                    // width={qwidth} height={qheight} viewBox="0 0 54 90"
                    width="94px" height="64px" viewBox="0 0 94 64"
                    xmlns="http://www.w3.org/2000/svg" 
                    xmlnsXlink="http://www.w3.org/1999/xlink">
              <title>Group</title>
    <desc>Created with Sketch.</desc>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="noun_desert_1190110" fill="#ABACAB" fill-rule="nonzero">
            <path d="M93.5,42.213 C93.449,42.178 88.38,38.631 84.311,36.212 C83.691,35.843 83.044,35.448 82.382,35.044 C78.891,32.912 74.971,30.522 71.983,30.171 C71.839,30.116 71.687,30.113 71.537,30.137 C71.447,30.132 71.355,30.122 71.267,30.122 C69.675,30.122 67.729,31.148 65.266,32.447 C62.19,34.069 58.36,36.088 54.697,36.088 C51.676,36.088 48.696,34.745 45.54,33.323 C44.104,32.677 42.645,32.027 41.147,31.479 L41.147,21.803 L46.17,16.78 C46.672,16.278 46.947,15.613 46.947,14.905 L46.947,6.161 C46.947,4.698 45.758,3.509 44.296,3.509 C42.834,3.509 41.645,4.698 41.645,6.161 L41.645,13.807 L41.147,14.305 L41.147,3.463 C41.147,2.001 39.958,0.812 38.496,0.812 C37.034,0.812 35.845,2.001 35.845,3.463 L35.845,19.45 L34.446,18.052 L34.446,8.766 C34.446,7.304 33.257,6.115 31.795,6.115 C30.333,6.115 29.144,7.304 29.144,8.766 L29.144,19.15 C29.144,19.858 29.42,20.524 29.92,21.025 L35.846,26.949 L35.846,30.195 C35.362,30.149 34.87,30.123 34.373,30.123 C27.647,30.123 20.977,32.197 13.379,36.652 C7.154,40.3 0.839,42.068 0.775,42.086 L0.127,42.266 L0.127,63.191 L93.878,63.191 L93.878,42.477 L93.5,42.213 Z M31.168,19.774 C31.004,19.609 30.909,19.381 30.909,19.149 L30.909,8.766 C30.909,8.279 31.305,7.882 31.793,7.882 C32.281,7.882 32.677,8.278 32.677,8.766 L32.677,18.784 L37.612,23.719 L37.612,3.463 C37.612,2.976 38.008,2.579 38.496,2.579 C38.984,2.579 39.38,2.975 39.38,3.463 L39.38,18.572 L43.413,14.538 L43.413,6.161 C43.413,5.673 43.809,5.276 44.297,5.276 C44.785,5.276 45.181,5.672 45.181,6.161 L45.181,14.905 C45.181,15.137 45.086,15.365 44.921,15.53 L39.38,21.071 L39.38,30.898 C39.37,30.896 39.362,30.894 39.354,30.892 C38.781,30.726 38.202,30.579 37.613,30.461 L37.613,26.216 L31.168,19.774 Z M92.108,61.422 L1.893,61.422 L1.893,43.598 C3.698,43.046 8.948,41.296 14.271,38.176 C20.456,34.55 25.794,32.606 31.159,32.058 C30.473,32.908 29.638,34.081 29.028,35.667 C28.854,36.132 28.694,36.625 28.585,37.153 C28.516,37.414 28.485,37.688 28.448,37.965 L28.42,38.173 L28.406,38.277 L28.4,38.369 L28.4,38.393 L28.4,38.443 C28.409,38.591 28.385,38.664 28.421,38.878 C28.532,39.696 28.926,40.229 29.372,40.702 C29.822,41.161 30.331,41.514 30.855,41.822 C31.907,42.441 33.031,42.91 34.17,43.358 C35.306,43.788 36.46,44.223 37.614,44.66 C38.755,45.103 39.887,45.564 40.907,46.151 C41.905,46.735 42.866,47.494 42.935,48.544 C42.997,49.592 42.454,50.621 41.887,51.472 C41.309,52.337 40.641,53.082 40.006,53.744 C38.721,55.063 37.53,56.046 36.689,56.717 C35.844,57.387 35.338,57.74 35.338,57.74 C35.338,57.74 35.858,57.41 36.734,56.778 C37.607,56.143 38.843,55.213 40.201,53.941 C40.872,53.298 41.582,52.576 42.222,51.706 C42.84,50.845 43.497,49.812 43.493,48.511 C43.472,48.349 43.463,48.158 43.424,48.016 L43.367,47.805 C43.351,47.759 43.359,47.759 43.326,47.674 L43.273,47.562 C43.142,47.257 42.957,46.979 42.742,46.744 C42.316,46.26 41.806,45.882 41.282,45.54 C40.224,44.866 39.086,44.346 37.951,43.844 C36.818,43.358 35.687,42.871 34.572,42.392 C33.475,41.904 32.41,41.397 31.493,40.798 C31.035,40.502 30.618,40.176 30.306,39.823 C29.993,39.495 29.794,39.052 29.774,38.808 C29.748,38.764 29.775,38.57 29.773,38.458 L29.773,38.432 L29.774,38.428 L29.791,38.34 L29.822,38.165 C29.867,37.934 29.898,37.704 29.97,37.485 C30.081,37.04 30.24,36.623 30.407,36.228 C31.094,34.65 32.066,33.519 32.752,32.778 C33.104,32.409 33.397,32.139 33.596,31.962 C33.627,31.937 33.64,31.926 33.666,31.903 C33.9,31.898 34.134,31.889 34.369,31.889 C35.137,31.889 35.89,31.969 36.638,32.089 C37.692,32.258 38.772,32.53 39.941,32.928 L40.012,32.952 C41.646,33.514 43.242,34.226 44.811,34.933 C48.145,36.435 51.294,37.854 54.695,37.854 C58.796,37.854 62.841,35.722 66.089,34.009 C68.157,32.918 70.111,31.888 71.266,31.888 C71.288,31.888 71.312,31.892 71.334,31.892 C71.476,32.028 71.67,32.225 71.913,32.486 C72.409,33.041 73.131,33.867 73.715,34.975 C74.003,35.526 74.265,36.148 74.374,36.814 C74.389,36.978 74.403,37.145 74.419,37.314 C74.41,37.482 74.402,37.65 74.393,37.82 L74.393,37.853 L74.392,37.861 C74.391,37.866 74.392,37.863 74.391,37.866 L74.381,37.905 L74.343,38.055 L74.268,38.357 C74.21,38.539 74.133,38.661 74.073,38.824 C73.747,39.486 73.212,40.165 72.643,40.82 C72.047,41.485 71.443,42.16 70.837,42.835 C70.24,43.534 69.642,44.25 69.182,45.064 C68.719,45.869 68.39,46.757 68.301,47.653 C68.226,48.566 68.393,49.379 68.633,50.165 C68.875,50.933 69.272,51.587 69.664,52.151 C70.478,53.275 71.392,53.988 72.038,54.445 C72.694,54.895 73.107,55.089 73.107,55.089 C73.107,55.089 72.707,54.87 72.083,54.384 C71.471,53.892 70.611,53.13 69.894,51.996 C69.547,51.428 69.207,50.782 69.026,50.046 C68.851,49.34 68.736,48.502 68.856,47.719 C68.988,46.927 69.324,46.156 69.794,45.443 C70.258,44.724 70.869,44.076 71.488,43.435 C72.133,42.798 72.778,42.162 73.413,41.534 C74.049,40.879 74.668,40.213 75.149,39.376 C75.26,39.151 75.392,38.903 75.47,38.692 L75.564,38.395 L75.61,38.247 L75.632,38.175 L75.639,38.155 L75.654,38.088 L75.655,38.076 L75.662,38.032 C75.69,37.797 75.727,37.561 75.742,37.331 C75.735,37.101 75.728,36.874 75.721,36.65 C75.631,35.764 75.355,34.995 75.056,34.325 C74.737,33.621 74.383,33.032 74.043,32.532 C76.314,33.411 79,35.051 81.46,36.553 C82.128,36.961 82.78,37.36 83.407,37.732 C86.78,39.738 90.864,42.54 92.107,43.4 L92.107,61.422 L92.108,61.422 Z" id="Shape"></path>
        </g>
    </g>
            </svg>
    </div>
    )}
}