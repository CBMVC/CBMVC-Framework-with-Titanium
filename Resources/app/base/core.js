/**
 * @file overview This file contains the core framework class CBMVC.
 * @version: 1.5.1.20120919
 * @author Winson  winsonet@gmail.com
 * @copyright Winson http://www.coderblog.in
 * @license MIT License http://www.opensource.org/licenses/mit-license.php
 *
 * @disclaimer THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * 	PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * The framework's base namespace,
 * all objects and method should be under this namespace
 */
var CB = {
	changeControllerDuration : (Ti.Platform.osname == 'android') ? 500 : 300,
	LoadControllers : undefined, //the controllers should be loaded.

	/**
	 * The app's name
	 */
	AppName : 'CBMVC',
	/**
	 *  Database 's name
	 */
	DBName : 'cbmvc',
	/**
	 * the root controller, can be set in app.js
	 */
	RootController : 'home',

	/**
	 * Launch the app, or only refresh a page
	 * @param {String} controller, should be a string with a controller name, etc. 'home','login'
	 * @param {Boolen} isRefreshSinglePage, true for just refresh a page, false for reload all pages
	 * @param {String} animate
	 */
	Launch : function(controller, isRefreshSinglePage, animate) {
		//CB.Platform.actInd.show();
		//set default language
		CB.Util.setDefaultLang(CB.DefaultLang);
		
		CB.Util.setCoreObj(CB);

		CB.CurrentLang = CB.Util.getCurrLang();

		//init debug mode
		CB.Debug.init(CB.DebugMode.sys);

		CB.DB.open(CB.DBName);

		if (isRefreshSinglePage) {
			//just referesh a page(view)
			var currController = CB.stackOfControllers[CB.stackOfControllers.length - 1];
			if (controller !== CB.RootController && currController != undefined) {
				//CB.mainView.remove(currController.view);
				currController = null;
			}
			CB.stackOfControllers[CB.controllers[controller]] = null;
			CB.stackOfControllers.pop();
			CB.controllers[controller] = {
				name : controller
			};
			CB.loadStyle();

			//controllers = [controller];
			//CB.includeControllers(controllers);
			CB.pushController(CB.controllers[controller], animate);
		} else {
			if (!controller) {
				controller = CB.RootController;
			}

			//reload all pages and return home page
			CB.stackOfControllers = [];

			CB.controllers = [];
			CB.includeControllers(CB.LoadControllers);
			CB.pushController(CB.controllers[controller], 'none');

		}

		//just load at first time
		//if (arguments.length == 0) {
		//	CB.openWindow();
		//}
	},

	/**
	 * Set the default language
	 */
	DefaultLang : 'en',
	/**
	 * Get and Set the current language
	 */
	CurrentLang : 'en',
	/**
	 * Languages
	 */
	Languages : {
		cn :{},
		en :{}
	},
	/**
	 * Orientation Modes
	 * Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT,Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT
	 */
	OrientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT],
	/**
	 * Debug mode setting
	 */
	DebugMode : {
		/**
		 * system debug mode
		 */
		sys : {
			/**
			 * debug mode
			 * 0: disable all debug messages
			 * 1: just display Debug.echo messages
			 * 2: display all debug messages, include dump object
			 */
			mode : 0,
			/**
			 * debug type, support Titanium debug type:
			 * info: display message with [INFO] style in console
			 * warn: display message with [WARN] style in console (default)
			 * error: display message with [ERROR] style in console
			 */
			msgType : 'info'

		},
		/**
		 * style debug mode
		 * true: enable debug mode
		 * false: disable debug mode
		 */
		style : false,
		/**
		 * api debug mode
		 * 'Y': disable encrypt all value of request details and response details
		 * 'N': encrypt all value of request details and response details
		 */
		api : 'N'
	},
	/**
	 * Platform relate methods
	 */
	Platform : {},
	/**
	 * Styles of each view
	 */
	Styles : {},
	/**
	 * Data model
	 */
	Models : {},
	/**
	 * Remote webserver's API
	 */
	API : {},
	/**
	 * Common function for controllers and views
	 */
	Common : {},
	/**
	 * Data base object (joli module)
	 */
	DB : {
		instance : undefined
	},
	/**
	 * Utility with the app (module)
	 */
	Util : {},
	/**
	 * Get data with Ajax call (module)
	 */
	Ajax : {},
	/**
	 * Debug method (module)
	 */
	Debug : {},
	/**
	 * Use the third-party plugins (module)
	 */
	Plugins : {}
};

Ti.include('/app/base/lib.js');

(function() {
	/*
	 * Initialization code
	 */
	CB.mainWindow = null;
	CB.stackOfControllers = [];
	//CB.controllers = {};

	CB.screenWidth = Ti.Platform.displayCaps.platformWidth;
	CB.screenHeight = Ti.Platform.displayCaps.platformHeight;

	CB.mainWindow = Ti.UI.createWindow({
		title : 'Main',
		exitOnClose : true,
		//width: CB.screenWidth,
		//height: CB.screenHeight,
		backgroundColor : '#fff'
	});

	CB.mainOverlay = Titanium.UI.createView({
		title : 'Overlay',
		left : 0,
		top : 0,
		right : 0,
		bottom : 0,
		//width:'100%',
		//height:'100%',
		//backgroundColor:'#000'
	});

	CB.mainView = Titanium.UI.createView({
		title : 'Main',
		left : 0,
		top : 0,
		width : CB.screenWidth,
		height : CB.screenHeight
	});

	CB.mainView.layouting = function(block) {
		this.startLayout();
		block();
		this.finishLayout();
	};

	CB.mainWindow.add(CB.mainView);

	if (CB.Platform.isAndroid()) {

		CB.mainWindow.addEventListener('android:back', function() {
			CB.popController();
		});
		/* Add android's menu
		 var params = {
		 buttons :[{
		 title : 'Home',
		 icon: CB.ApplicationDirectory + 'images/cnbtn.png',
		 clickevent : function(){
		 CB.Launch(null, null, 'right');
		 }
		 },{
		 title : 'Login',
		 icon: CB.ApplicationDirectory + 'images/cnbtn.png',
		 clickevent : function(){
		 CB.pushController(CB.controllers.login);
		 }
		 },{
		 title : 'test 3',
		 icon: CB.ApplicationDirectory + 'images/cnbtn.png',
		 clickevent : function(){
		 alert('test button');
		 }
		 }]
		 }
		 CB.Platform.android.menu.init(params);
		 */

	}

	CB.openWindow = function() {
		//if(!CB.Platform.isAndroid()){
		//CB.mainWindow.fullscreen = true;
		//}

		CB.Platform.actInd.init(CB.mainWindow);
		
		CB.mainWindow.orientationModes = CB.OrientationModes;
		CB.mainWindow.open();
	};

	
	/**
	 * Push the controller to next screen
	 * @param {String} controller, which controller need to show
	 * @param {String} animate,
	 *  none : no animation
	 *  left or don't set it, for move to left animation
	 * 	right: for move to right animation, default move to left
	 * 	up: for move to up animation, default move to left
	 * 	down: for move to down animation, default move to left
	 */
	CB.pushController = function(/*Controller*/controller, animate, isLaunch,callback) {
		//CB.Platform.actInd.show();
		var previous = (CB.stackOfControllers.length == 0) ? null : CB.stackOfControllers[CB.stackOfControllers.length - 1];

		/*
		 if (previous === null) {
		 controller.view.left = 0;
		 CB.mainView.add(controller.view);
		 return;
		 }*/
		if(!CB.mainView.targetView){
		    CB.mainView.targetView = Ti.UI.createView({
                width:CB.screenWidth,
                height:CB.screenHeight
            });
            CB.mainView.sourceView = Ti.UI.createView({
                width:CB.screenWidth,
                height:CB.screenHeight
            });
            CB.mainView.add(CB.mainView.targetView);
            CB.mainView.add(CB.mainView.sourceView);
		}

        var target = CB.mainView.targetView;
        var source = CB.mainView.sourceView;
        target.show();
        source.show();
        
		var animationTop = 0;
		var animationLeft = -CB.screenWidth;

		//reset the mainView at first
		// CB.mainView.left = 0;
		// CB.mainView.top = 0;
		// CB.mainView.width = CB.screenWidth;
		// CB.mainView.height = CB.screenHeight;

		//load the controller runtime
		if (!controller.view) {
			controller = CB.loadController(controller);
		}
		controller.view.left = 0;
		controller.view.top = 0;

		if (CB.Plugins._.include(CB.stackOfControllers, controller)) {
			var aIndex = CB.Plugins._.indexOf(CB.stackOfControllers, controller);
			CB.stackOfControllers.splice(aIndex, 1);
		}

		CB.stackOfControllers.push(controller);
		controller.animate = animate;
		 if (animate === 'right') {
			CB.mainView.layouting(function() {
				CB.mainView.width = CB.screenWidth * 2;
                CB.mainView.height = CB.screenHeight;
				CB.mainView.left = -CB.screenWidth;
				CB.mainView.top = 0;
				target.left = 0;
				target.top = 0;
				target.add(controller.view);

				if (previous !== null) {
                    source.left = CB.screenWidth;
				    source.top = 0;
					previous.base.viewWillDisappear(previous);
				}
				controller.base.viewWillAppear(controller);
			});
			animationLeft = 0;
		} else if (animate === 'down') {
			CB.mainView.layouting(function() {
                CB.mainView.width = CB.screenWidth;
				CB.mainView.height = CB.screenHeight * 2;
                CB.mainView.left = 0;
				CB.mainView.top = -CB.screenHeight;
				target.left = 0;
                target.top = 0;
                target.add(controller.view);

				if (previous !== null) {
					source.top = CB.screenHeight;
					source.left = 0;
					previous.base.viewWillDisappear(previous);
				}
				controller.base.viewWillAppear(controller);
			});
			animationLeft = 0;
		} else if (animate === 'up') {
			CB.mainView.layouting(function() {
                CB.mainView.width = CB.screenWidth;
				CB.mainView.height = CB.screenHeight * 2;
                CB.mainView.left = 0;
                CB.mainView.top = 0;
				target.left = 0;
                target.top = CB.screenHeight;
                target.add(controller.view);

				if (previous !== null) {
				    source.top = 0;
				    source.left = 0;
					previous.base.viewWillDisappear(previous);
				}
				controller.base.viewWillAppear(controller);
			});
			animationLeft = 0;
			animationTop = -CB.screenHeight;
		} else if(!animate || animate === 'left'){
			CB.mainView.layouting(function() {
				CB.mainView.width = CB.screenWidth * 2;
                CB.mainView.height = CB.screenHeight;
                CB.mainView.left = 0;
                CB.mainView.top = 0;
				target.left = CB.screenWidth;
                target.top = 0;
                target.add(controller.view);

                if (previous !== null) {
                    source.left = 0;
                    source.top = 0;
                    previous.base.viewWillDisappear(previous);
                }
				controller.base.viewWillAppear(controller);
			});
            animationLeft = -CB.screenWidth;
            animationTop = 0;
		}

		if(animate == 'none'){
		    CB.mainView.layouting(function() {
                
                if(isLaunch){
                	 CB.mainView.width = CB.screenWidth;
                	 target.left = 0;
                }else{
                	CB.mainView.left = 0;           
                	CB.mainView.top = 0;
	                CB.mainView.width = CB.screenWidth * 2;
	                target.left = CB.screenWidth;
                }
                
                /*
                CB.mainView.width = CB.screenWidth;
                CB.mainView.height = CB.screenHeight;
                CB.mainView.left = 0;   
                CB.mainView.top = 0;
				
                target.top = 0;
                target.left = 0;
                */
                controller.base.viewWillAppear(controller);
                target.add(controller.view);

                if (previous !== null) {
                   previous.base.viewWillDisappear(previous);
                   source.remove(previous.view);
                   previous.base.viewDidDisappear(previous);
                }
                
                if(!isLaunch){
	                CB.mainView.left = -CB.screenWidth;           
	                CB.mainView.top = 0;
                }
                
                source.hide();
                CB.mainView.sourceView = target;
                CB.mainView.targetView = source;
                controller.base.viewDidAppear(controller);
            });
            if(callback){
                callback();
            }
		}else{
		    var animParam = {
                duration : CB.changeControllerDuration,
                left : animationLeft,
                top : animationTop
            };
            if(!CB.Platform.isAndroid()){
                animParam.curve = Ti.UI.ANIMATION_CURVE_EASE_IN_OUT;
            }
            CB.mainView.animate(animParam, function() {
                CB.mainView.layouting(function() {
                    
                    // CB.mainView.left = 0;
                    // CB.mainView.top = 0;
                    // CB.mainView.width = CB.screenWidth;
                    // CB.mainView.height = CB.screenHeight;
                    // target.top = 0;
                    // target.left = 0;
    
                    if (previous !== null) {
                        previous.base.viewWillDisappear(previous);
                        source.remove(previous.view);
                        previous.base.viewDidDisappear(previous);
                    }
                    CB.mainView.sourceView = target;
                    CB.mainView.targetView = source;
                    controller.base.viewDidAppear(controller);
                    //CB.Platform.actInd.hide();
                    //alert('sourceView:' + CB.mainView.sourceView.children.length + '\n\rtargetView:' + CB.mainView.targetView.children.length);
                    /*
                    if(isLaunch){
                       // CB.stackOfControllers = [controller];
                       // CB.controllers = [controller.name];
                       // CB.includeControllers(CB.LoadControllers);
                    }*/
                });
                if(callback){
                    callback();
                }
            });
		}
	};

	/**
	 * Pop the controller and back to the previous view
	 */
	CB.popController = function(animate,callback) {
		if (CB.stackOfControllers.length <= 1)
			return;

		var top = CB.stackOfControllers[CB.stackOfControllers.length - 1];
		var previous = CB.stackOfControllers[CB.stackOfControllers.length - 2];
		CB.stackOfControllers.pop();

		var target = CB.mainView.targetView;
        var source = CB.mainView.sourceView;
        target.show();
        source.show();

        //reset the mainView at first
        // CB.mainView.left = 0;
        // CB.mainView.top = 0;
        // CB.mainView.width = CB.screenWidth;
        // CB.mainView.height = CB.screenHeight;

		var animationTop = 0;
        var animationLeft = 0;
        // use previous view's animate
        
        if(!animate && top.animate){
            var animMap = {
                none : 'none',
                left : 'right',
                right : 'left',
                up : 'down',
                down : 'up'
            }
            animate = animMap[top.animate];
        }
		 if (animate === 'right') {
            CB.mainView.layouting(function() {
                CB.mainView.width = CB.screenWidth * 2;
                CB.mainView.height = CB.screenHeight;
                CB.mainView.left = 0;
                CB.mainView.top = 0;
                source.left = 0;
                source.top = 0;
                if (previous !== null) {
                    target.left = CB.screenWidth;
                    target.top = 0;
                    target.add(previous.view);
                    previous.base.viewWillAppear(previous);
                }
                top.base.viewWillDisappear(top);
            });
            animationLeft = -CB.screenWidth;
        } else if (animate === 'up') {
            CB.mainView.layouting(function() {
                CB.mainView.width = CB.screenWidth;
                CB.mainView.height = CB.screenHeight * 2;
                CB.mainView.left = 0;
                CB.mainView.top = 0;
                source.left = 0;
                source.top = 0;
                if (previous !== null) {
                    target.left = 0;
                    target.top = CB.screenHeight;
                    target.add(previous.view);
                    previous.base.viewWillAppear(previous);
                }
                top.base.viewWillDisappear(top);
            });
            animationTop = -CB.screenHeight;
        } else if (animate === 'down') {
            CB.mainView.layouting(function() {
                CB.mainView.width = CB.screenWidth;
                CB.mainView.height = CB.screenHeight * 2;
                CB.mainView.left = 0;
                CB.mainView.top = -CB.screenHeight;
                source.left = 0;
                source.top = CB.screenHeight;
                if (previous !== null) {
                    target.left = 0;
                    target.top = 0;
                    target.add(previous.view);
                    previous.base.viewWillAppear(previous);
                }
                top.base.viewWillDisappear(top);
            });
            animationTop = 0;
        } else if(!animate || animate === 'left'){
            CB.mainView.layouting(function() {
                CB.mainView.width = CB.screenWidth * 2;
                CB.mainView.height = CB.screenHeight;
                CB.mainView.left = -CB.screenWidth;
                CB.mainView.top = 0;
                source.left = CB.screenWidth;
                source.top = 0;
                if (previous !== null) {
                    target.left = 0;
                    target.top = 0;
                    target.add(previous.view);
                    previous.base.viewWillAppear(previous);
                }
                top.base.viewWillDisappear(top);
            });
        }
        if(animate == 'none'){
            CB.mainView.layouting(function() {
                CB.mainView.left = 0;
                CB.mainView.top = 0;
                CB.mainView.width = CB.screenWidth;
                CB.mainView.height = CB.screenHeight;
                top.base.viewWillDisappear(top);
                if (previous !== null) {
                    target.top = 0;
                    target.left = 0;
                    previous.top = 0;
                    previous.base.viewWillAppear(previous);
                    target.add(previous.view);
                    previous.base.viewDidAppear(previous);
                }
                source.remove(top.view);
                source.hide();
                CB.mainView.sourceView = target;
                CB.mainView.targetView = source;
                top.base.viewDidDisappear(top);
            });
            if(callback){
                callback();
            }
        }else{
            var animParam = {
                duration : CB.changeControllerDuration,
                left : animationLeft,
                top : animationTop
            };
            //if(!CB.Platform.isAndroid())
            //    animParam.curve = Ti.UI.ANIMATION_CURVE_EASE_IN_OUT;
            CB.mainView.animate(animParam, function() {
                CB.mainView.layouting(function() {
                    // CB.mainView.left = 0;
                    // CB.mainView.top = 0;
                    // CB.mainView.width = CB.screenWidth;
                    // CB.mainView.height = CB.screenHeight;
                    
                    if (previous !== null) {
                         target.top = 0;
                         target.left = 0;
                         previous.top = 0;
                        previous.base.viewDidAppear(previous);
                    }
                    source.remove(top.view);
                    CB.mainView.sourceView = target;
                    CB.mainView.targetView = source;
                    top.base.viewDidDisappear(top);
                    //CB.controllers[top.name] = {name: top.name};
                    //alert('pop:' + CB.mainView.children.length);
                });
                if(callback){
                    callback();
                }
            });
        }
	}
	/**
	 * Set the root controller to start the app
	 * @param {String} controller, which controller need to show
	 * @param {String} animate,
	 *  left or don't set it, for move to left animation
	 * 	right: for move to right animation, default move to left
	 * 	up: for move to up animation, default move to left
	 * 	down: for move to down animation, default move to left
	 */
	CB.setRootController = function(/*Controller*/controller, animate) {
		//CB.Debug.echo(animate, 425);
		CB.pushController(controller, animate);
	};

	CB.require = function(path, viewName) {
		//for debug to test the run time
		var startTime = new Date().getTime();
		startTime = new Date('2011-04-11 11:51:00');

		__exports = {
			viewName : viewName
		};
		Ti.include(path + '.js');
		//for debug to test the run time
		var endTime = new Date().getTime();
		endTime = new Date('2011-04-11 12:51:00');
		CB.Debug.echo(viewName + ' run time:' + (endTime - startTime) / 1000 + 'sec');

		return __exports;
	};

	CB.loadStyle = function() {
		//reload the styles when refresh the page
		CB.Styles = null;
		var loadStyle = '/app/styles/styles.js';
		//load difference platform style only
		var styleFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + 'app/styles/' + CB.Platform.osname + '.styles.js');
		if (styleFile.exists()) {
			loadStyle = '/app/styles/' + CB.Platform.osname + '.styles.js';
		}
		Ti.include(loadStyle);
	};

	CB.includeControllers = function(names) {

		//reload the styles when refresh the page
		CB.loadStyle();

		for (var i = 0; i < names.length; i++) {
			var controllerName = names[i];
			CB.controllers[controllerName] = {
				name : controllerName
			};
			//CB.controllers[controllerName] = new CB.Controller(controllerName, CB.require('/app/controllers/' + controllerName));
			//CB.controllers[controllerName].name = controllerName;
		}
	};

	CB.loadController = function(controller) {
		var tmpObj = controller;
		var controllerName = controller.name;
		CB.controllers[controllerName] = new CB.Controller(controllerName, CB.require('/app/controllers/' + controllerName));
		CB.controllers[controllerName].name = controller.name;
		CB.controllers[controllerName].view.name = controller.name;

		for (var data in tmpObj) {
			//CB.Debug.dump(data, 594, 'core.js');
			//CB.Debug.dump(tmpObj[data], 595, 'core.js');
			CB.controllers[controllerName][data] = tmpObj[data];
		}
		return CB.controllers[controllerName];
	};

	CB.Controller = function(name, functions) {
		var self = this;

		this.base = {};
		this.base.viewLoaded = function(e) {
			if (self.viewLoaded !== undefined)
				self.viewLoaded(e);
		};
		this.base.viewWillAppear = function(e) {
			//add a refresh button for testing layout, just for debug mode
			if (CB.DebugMode.sys.mode != 0) {
				//CB.Debug.addRefreshBtn(CB, e.view);
			}

			if (self.viewWillAppear !== undefined) {
				self.viewWillAppear(e);
			}
		};

		this.base.viewDidAppear = function(e) {
			if (self.viewDidAppear !== undefined)
				self.viewDidAppear(e);
		};

		this.base.viewWillDisappear = function(e) {
			if (self.viewWillDisappear !== undefined)
				self.viewWillDisappear(e);
		};

		this.base.viewDidDisappear = function(e) {
			if (self.viewDidDisappear !== undefined)
				self.viewDidDisappear(e);
		};

		CB.mixin(this, functions);

		this.view = CB.require('/app/views/' + name, name);

		this.view.left = 0;
		this.view.top = 0;
		this.view.width = CB.screenWidth;
		this.view.bottom = 0;

		this.base.viewLoaded(this);
		//CB.Debug.echo(name + ' is loaded',216);
	};

	/**
	 * Format the string with {0}{1} format
	 */
	String.prototype.format = function() {
		var formatted = this;
		for (var i = 0; i < arguments.length; i++) {
			var regexp = new RegExp('\\{' + i + '\\}', 'gi');
			formatted = formatted.replace(regexp, arguments[i]);
		}
		return formatted;
	};

	// use date format module
	Date.prototype.format = function(mask, utc) {
		return CB.Util.date.format(this, mask, utc);
	};

})();
