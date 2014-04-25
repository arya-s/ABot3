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

exports.convertTime = function(duration){
    var t = duration.match(/\d+/g);

    if(duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1){
        t = [0, t[0], 0];
    }

    if(duration.indexOf('H') >= 0 && duration.indexOf('M') == -1){
        t = [t[0], 0, t[1]];
    }
    if(duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1){
        t = [t[0], 0, 0];
    }

    var out = '';
    if(t.length == 3) {
        out = t[0] + ':' + lz(t[1]) + ':' + lz(t[2]);
    }

    if(t.length == 2){
        out = lz(t[0]) + ':' + lz(t[1]);
    }

    if(t.length == 1){
        out = '0:' + lz(t[0]);
    }

    return out;
};

//Insert leading zero if numbers are single digit
function lz(num){
    if(num.length < 1){
        return '0' + num;
    }

    return num;
}
