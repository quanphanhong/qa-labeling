exports.timestampToString = ( timestamp ) => {
    var a = new Date( timestamp * 1000 );
    var months = [ 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec' ];
    var year = a.getFullYear();
    var month = months[ a.getMonth() ];
    var date = a.getDate();
    var hour = transformOneToTwoDigits( a.getHours() );
    var min = transformOneToTwoDigits( a.getMinutes() );
    var sec = transformOneToTwoDigits( a.getSeconds() );
    var time = date + ' ' + month + ' ' + year + ' [' + hour + ':' + min + ':' + sec + ']';
    return time;
}

const transformOneToTwoDigits = ( value ) => {
    const res = value.toString();

    if ( res.length === 1 ) {
        return "0" + res;
    } else {
        return res;
    }
}