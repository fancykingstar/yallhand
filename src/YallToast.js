import { toast } from 'react-toastify';
import  { css } from 'glamor'

export default {
  success(msg, options = {}){
    return toast.success(msg, {
      // Merge additionals options
      ...options,
      className: css({
        textAlign: "center",
  fontFamily: 'Nunito Lato',
  minHeight:" 50px !important",
  background: "rgb(0, 183, 255) !important",
  color: "#FFFFFF",
  borderRadius: "4px !important",
  boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.3) !important"
      })
    });
  },
  error(msg, options = {}){
    return toast.error(msg, {
        // Merge additionals options
        ...options,
        className: css({
          textAlign: "center",
    fontFamily: 'Nunito Lato',
    minHeight:" 50px !important",
    background: "#f20404 !important",
    color: "#FFFFFF",
    borderRadius: "4px !important",
    boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.3) !important"
        })
      });
    },
}
