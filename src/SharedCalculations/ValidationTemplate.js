import React from "react";
import toast from "../YallToast";

export const validate = (conditions) => {
        let errors = []
        const valid = !Object.values(conditions).filter(i => !i).length;
        if(!valid) {
          Object.keys(conditions).forEach(i=>{
            if (!conditions[i]) errors.push(i);
          });
          
          toast.error(`Please review the following fields before proceeding: ${errors.join(', ')}`, {hideProgressBar: true})
        }
        return {valid, errors};
      
    
}