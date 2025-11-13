export class ValidationHelper {


    validLengthString(val : string, length :number, messageError : string){
        if(val.length > length){
            throw new Error(messageError);
        }
    }

    validNumber(val : any, maxVal :number | any, minVal :number | any, messageError : string){
        if(isNaN(val)){
            throw new Error(messageError);
        }
        if(maxVal!=null){
            if(Number(val) > maxVal ){
                throw new Error(messageError + ` maximo valor permitido : ${maxVal}` );
            }
        }
        if(minVal!=null){
            if(Number(val) < minVal ){
                throw new Error(messageError + ` minimo valor permitido : ${minVal}` );
            }
        }
    }

    compareDates(dateMax: Date, dateMin: Date,messageError : string){
        if(dateMax > dateMin){
            throw new Error(messageError);
        }
    }

    isValidString(input: string,messageError : string,regex : RegExp = /^[a-zA-Z0-9]*$/) {
        if(!regex.test(input)){
            throw new Error(messageError);
        }
    }

    validateIsNotEmpty(val : any,messageError : string){
        if(val == null || val == undefined || String(val).trim() == ""){
            throw new Error(messageError);
        }
    }

}
