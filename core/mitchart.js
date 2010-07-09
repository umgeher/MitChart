/* MitChart - Javascript's library for charts in canvas  */
/* Require {MitCanvas}                                   */
/* Developer: Thiago Tiveron Favaro {tiveron@mitgnu.com} */
/* MitGnu Software House - http://www.mitgnu.com         */


// using namespace mitchart
//var mitchart = window.mitchart || {};

var Mitchart = function(data){
  //properties
  this.data = data;
  this.option = {};

  // get values from sorce
  this.__getValues__();

  return true;
};

// prototype methods
Mitchart.prototype = {
  // plot method, print chart on screen
  'plot': function(){
    // do something
  },

  // getter method
  '__get__': function(arg){
    return this.option[arg];
  },

  // setter method
  '__set__': function(arg, value){
    return this.option[arg] = value;
  },

  // get values from class data source
  '__getValues__': function(){
    this.option['target'] = this.__set__('target', this.data['target']);
    this.option['type'] = this.__set__('type', this.data['type']);
    this.option['xlabel'] = this.__set__('xlabel', this.data['data']['x']['label']);
    this.option['ylabel'] = this.__set__('ylabel', this.data['data']['y']['label']);
    this.option['xvalues'] = this.__set__('xvalues', this.data['data']['x']['values']);
    this.option['yvalues'] = this.__set__('yvalues', this.data['data']['y']['values']);
  }
  
};
