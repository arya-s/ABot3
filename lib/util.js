var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

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

    var t    = duration.match(/\d+[HMS]/g);
    var parsed = {
        'H': 0,
        'M': 0,
        'S': 0
    };
    var out  = [];

    for (var i = 0; i<t.length; i++) {

        var raw       = t[i];
        var time      = Number(raw.match(/\d+/g));
        var indicator = raw[raw.length-1];

        if (indicator !== 'H') {
            time = lz(time);
        }

        console.log('writing', indicator, time);
        parsed[indicator] = time;

    }

    for (var k in parsed) {
        if (parsed.hasOwnProperty(k)) {
            out.push(parsed[k]);
        }
    }


    return out.join(':');

};

// Insert leading zero if numbers are single digit
function lz(num){

    if(num < 10){
        return '0' + num;
    }

    return num;

}

//Allowing k, m, b, by acies
exports.parseNumber = function(str){
    var re = /\s*([0-9]+(?:\.[0-9]+)?)([kKmMbBeE])?([0-9]+(?:\.[0-9]+)?)?\s*/;
    var match = str.match(re);
    var n;

    if(match !== null){
        n = parseFloat(match[1]);

        if(typeof match[2] === 'string'){
            var p = match[2].toLowerCase();
            var m = parseFloat(match[3]) || 0;

            if(p == 'k'){
                n *= 1e3;
            } else if(p == 'm'){
                n *= 1e6;
            } else if(p == 'b'){
                n *= 1e9;
            } else if(p == 'e'){
                n *= Math.pow(10, m);
                m = 0;
            }

            if(m !== 0){
                m *= Math.pow(10, (n|0).toString().length - 3);
                n += m;
            }
        }
    }

    return n;
};

exports.toFahrenheit = function(str){
    var re = /^-?[0-9]\d*(\.\d+)?$/;
    var match = str.match(re);

    if(match !== null){
        var c = match[0];

        return c * 1.8 + 32;
    }

    return null;
};

exports.toCelsius = function(str){
    var re = /^-?[0-9]\d*(\.\d+)?$/;
    var match = str.match(re);

    if(match !== null){
        var f = match[0];

        return (f-32) * 0.5555555555555556;
    }

    return null;
};

exports.isUrl = function(text) {
    return urlPattern.test(text);
};

exports.getUrl = function(text) {

    if (exports.isUrl(text)) {
        return  text.match(urlPattern)[0];
    }

};
