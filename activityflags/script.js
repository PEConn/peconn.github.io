// NOTE: data.js must be loaded before this.

var app = new Vue({
    el: '#app',
    data: {
        allFlags: getFlags(),
        filter: ""
    },
    computed: {
        filteredFlags: function() {
            return this.allFlags.filter(x => flagActive(this.filter, x.value));
        }
    }
})

function flagActive(value, flag) {
    // Don't bother filtering until the full input has been entered.
    if (value.length !== "0x00000000".length) return true;

    var valueInt = parseInt(value);
    var flagInt = parseInt(flag);
    if (isNaN(valueInt)) return true;
    if (isNaN(flagInt)) {
        console.warn("Error in data, can't parse " + flag);
        return true;
    }

    return (valueInt & flagInt) != 0;
}