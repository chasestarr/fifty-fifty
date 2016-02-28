module.exports = function(mongoose){
  var restaurantSchema = mongoose.Schema({
      restaurantId: String,
      host: Boolean
  });

  restaurantSchema.methods.hostFlag = function() {
      var flag = this.host ? 'The host ' + this.host : 'I do not have a host';

      console.log(flag);
  };

  return mongoose.model('Restaurant', restaurantSchema);

};

