exports.trim = function(str){
    //By http://blog.stevenlevithan.com/archives/faster-trim-javascript
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

exports.rnd = function(from, to){
    return Math.floor((Math.random()*to)+from);
};

exports.obscure = function(str, op){
    var obscurePosition = this.rnd(1, str.length-1);
    return [str.slice(0, obscurePosition), op, str.slice(obscurePosition)].join('');
};
