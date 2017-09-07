var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shop');
var user = mongoose.model('user', {
    username: String,
    password: String,
    addtime: Date,
    uptime: Date,
    ip: String,
    img: String,
    hobby: Object,
    tel: String,
    email: String,
    sex: String,
    age: Number

});
var car = mongoose.model('car', {
    carname: String,
    carprice: String,
    cardis: String,
    single: String,
    img: String
});
module.exports = {
    user: user,
    car: car,
    rand: function(m, n) {
        return Math.floor(Math.random() * (n - m + 1) + m);
    }
}