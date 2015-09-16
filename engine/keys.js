module.exports = function(model, cb){
    model.count({}, function(err, count){
        model.findOne().sort('updated_at').exec(function(err, item) {
            var data = '_ID' + item.id + '_C' + count.toString();
            cb( data )
        });
    })
};