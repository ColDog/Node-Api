module.exports = function(model, cb){
    model.count({}, function(err, count){
        model.findOne().sort('updated_at').exec(function(err, item) {
            var data = item.id + count.toString();
            cb( data )
        });
    })
};