

export class AudioHelper {
    static fractionate(val, minVal, maxVal) {
        return (val - minVal)/(maxVal - minVal);
    }
    
    static modulate(val, minVal, maxVal, outMin, outMax) {
        var fr = this.fractionate(val, minVal, maxVal);
        var delta = outMax - outMin;
        return outMin + (fr * delta);
    }
    
    static avg(arr){
        var total = arr.reduce(function(sum, b) { return sum + b; });
        return (total / arr.length);
    }
    
    static max(arr){
        return arr.reduce(function(a, b){ return Math.max(a, b); })
    }
}