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
    this.canvas = null; // initiate a null object for canvas context
    this.conf = {
	'stage': {
	    'padding': 5,
	    'strokeColor': 'rgb(0, 0, 0)',
	    'strokeWidth': 1.7
	},
	'lines': {
	    'lineWidth': 2,
	    'lineColor': 'rgb(50, 50, 50)',
	    'ballFillColor': 'rgb(250, 250, 250)'
	},
	'labels': {
	    'font': 'arial',
	    'size': 12
	},
	'grid': {
	    'lineColor': 'rgb(30, 30, 30)',
	    'lineWidth': 0.1
	}
    };

    // get values from sorce
    this.__getValues__();

    return true;
};

// prototype methods
Mitchart.prototype = {
    // plot method, print chart on screen
    'plot': function(){
	// make the magic
	this.__makeCanvas__();
	this.canvas = this.__getCanvas__(); // get the canvas context to a object to make him global
	this.__makeStage__();
	this.__makeGrid__();
	this.__makeChart__();
	
	canvas = document.getElementById(this.__get__('target') + '_canvas');

	canvas.addEventListener("mousemove", 
				function(e) { 
				    console.log("x:"+(e.clientX-canvas.offsetLeft)
					  +" y:"+(e.clientY-canvas.offsetTop)); 
				}, false);
	


	return true;
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
	this.option['width'] = this.__set__('width', this.data['width']);
	this.option['height'] = this.__set__('height', this.data['height']);

	return true;
    },

    // return canvas context
    '__getCanvas__': function(){
	var canvas = document.getElementById(this.__get__('target') + '_canvas');
	var context = canvas.getContext('2d');

	return context;
    },

    // get the top value of list or lists
    '__getMaxValue__': function(){
	var data = this.__get__('yvalues');
	var max = 0;

	for(var x = 0; x < data.length; x++){
	    if(data[x] > max){
		max = data[x];
	    }
	}
	
	return max;
    },

    // make the canvas element on placeholder
    '__makeCanvas__': function(){
	var newCanvas = document.createElement('canvas');
	newCanvas.setAttribute('id', this.__get__('target') + '_canvas');
	newCanvas.setAttribute('width', this.__get__('width'));
	newCanvas.setAttribute('height', this.__get__('height'));

	var target = document.getElementById(this.__get__('target'));
	target.appendChild(newCanvas);

	return true;
    },

    // make the stage for chart
    '__makeStage__': function(){
	this.canvas.strokeStyle = this.conf.stage.strokeColor;
	this.canvas.lineWidth = this.conf.stage.strokeWidth;
	this.canvas.strokeRect(
	    this.conf.stage.padding,
	    this.conf.stage.padding,
	    (this.data['width'] - (this.conf.stage.padding * 2)),
	    (this.data['height'] - (this.conf.stage.padding * 2))
	);

	return true;
    },

    // make labels for chart
    '__makeLabels__': function(){
	return true;
    },

    // make a grid for chart
    '__makeGrid__': function(){
	var ybegin = this.__get__('height') - this.conf.stage.padding + (this.conf.grid.lineWidth / 2);
	var xstep = (this.__get__('height') - (2 * this.conf.stage.padding)) / this.__get__('xvalues').length;

	var xbegin = this.conf.stage.padding;
	var ystep = (this.__get__('width') - (2 * this.conf.stage.padding)) / this.__get__('yvalues').length;
	
	this.canvas.lineWidth = this.conf.grid.lineWidth;
	this.canvas.lineStyle = this.conf.grid.lineColor;
	
	// xgrid
	for(var x = 0; x < this.__get__('xvalues').length + 1; x++){
	    this.canvas.beginPath();
	    this.canvas.moveTo(
		this.conf.stage.padding,
		ybegin - (x * xstep)
	    );
	    this.canvas.lineTo(
		this.__get__('width') - this.conf.stage.padding,
		ybegin - (x * xstep)
	    );
	    this.canvas.stroke();
	    this.canvas.closePath();
	}
	
	// ygrid
	for(var y = 0; y < this.__get__('yvalues').length + 1; y++){
	    this.canvas.beginPath();
	    this.canvas.moveTo(
		xbegin + (y * ystep),
		this.conf.stage.padding
		
	    );
	    this.canvas.lineTo(
		xbegin + (y * ystep),
		this.__get__('height') - this.conf.stage.padding
	    );
	    this.canvas.stroke();
	    this.canvas.closePath();
	}

	return true;
    },

    '__makeChart__': function(){
	var type = this.__get__('type');
	if(type == 'line'){
	    this.__makeLineChart__();
	} 
	else if(type == 'bar')
	    this.__makeBarChart__();
	else {
	    this.__makeLineChart__();
	}
	
	return true;
    },

    '__makeLineChart__': function(){
	var data = this.__get__('yvalues');
	var xbegin = this.conf.stage.padding;
	var ybegin = this.__get__('height') - this.conf.stage.padding + (this.conf.grid.lineWidth / 2);
	var ystep = (this.__get__('width') - (2 * this.conf.stage.padding)) / this.__get__('yvalues').length;
	var stageHeight = this.__get__('height') - (2 * this.conf.stage.padding);
	var color = 'rgb('+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+')';
	

	// draw data line
	this.canvas.lineWidth = this.conf.lines.lineWidth;
	this.canvas.strokeStyle = color;
	this.__getMaxValue__();
	this.canvas.beginPath();
	
	for(var x = 0; x < data.length; x++){
	    var value = (data[x] * stageHeight) / this.__getMaxValue__();
	    if(x == 0){
		this.canvas.moveTo(
		    xbegin,
		    ybegin - value
		);
	    } else {
		
		this.canvas.lineTo(
		    xbegin + (x * ystep),
		    ybegin - value
		);
	    }
	}
	
	this.canvas.stroke();


	// draw points
	for(var x = 0; x < data.length; x++){
	    var value = (data[x] * stageHeight) / this.__getMaxValue__();
	    this.canvas.beginPath();
	    this.canvas.arc(
		xbegin + (x * ystep),
		ybegin - value,
		3,0,Math.PI*2,true); // Outer circle  
	    this.canvas.stroke(); 
	    this.canvas.fillStyle = this.conf.lines.ballFillColor;
	    this.canvas.fill();
	    this.canvas.closePath;
	}
	
	return true;
    },

    '__makeBarChart__': function(){
	return true;
    }
    
};
