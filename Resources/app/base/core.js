/**
 * @file overview This file contains the core framework class CBMVC.
 * @version: 1.5
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
	__changeControllerDuration : 250,
	LoadControllers : undefined, //what the controllers should be loaded.
	/**
	 * The framework's version
	 */
	Version: '1.5',
	/**
	 * the root controller, can be set in app.js
	 */
	RootController : 'home',

	/**
	 * The app's name
	 */
	AppName : 'CBMVC',
	/**
	 * Launch the app, or only refresh a page
	 * @param {String} controllers, should be a string and split with a comma, etc. 'home','login'
	 * @param {Boolen} isRefreshSinglePage, true for just refresh a page, false for reload all pages
	 * @param {String} animate
	 */
	Launch : function(controller, isRefreshSinglePage, animate) {

		//set default language
		CB.Util.setDefaultLang(CB.DefaultLang);

		CB.CurrentLang = CB.Util.getCurrLang();

		//init debug mode
		CB.Debug.init(CB.DebugMode.sys);

		CB.DB.open(CB.DBName);

		if (isRefreshSinglePage) {
			//just referesh a page(view)
			var currController = CB.stackOfControllers[CB.stackOfControllers.length - 1];
			if (controller !== CB.RootController && currController != undefined) {
				//CB.mainView.remove(currController.view);
				CB.stackOfControllers[currController] = null;
				CB.stackOfControllers.pop();
				CB.controllers[controller] = null;
				currController = null;
			}
			
			CB.controllers[controller] = {name: controller};
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
			CB.pushController(CB.controllers[controller], animate);

		}

		//just load at first time
		if (arguments.length == 0) {
			CB.openWindow();
		}
	},


	/**
	 * Set the default language
	 */
	DefaultLang : 'en',
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
	 *  Database 's name
	 */
	DBName : 'cbmvc',
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
		CB.mainWindow.open();
	};

	/**
	 *  Batch push the controllers and reload all pages
	 *  @param {Object} controllers, which controller need to be push
	 *  @param {String} animate
	 */
	CB.batchPushControllers = function(controllers, animate) {
		CB.Platform.actInd.show();

		//reload all pages and return home page
		 for (var i = 0, l = CB.stackOfControllers.length; i < l; i++) {
			 if (CB.stackOfControllers[i] != undefined) {
				 CB.mainView.remove(CB.stackOfControllers[i].view);
				 CB.stackOfControllers.splice(i, 1);
				 CB.stackOfControllers[i] = null;
				 CB.stackOfControllers.pop();
			 }
		 }
		CB.stackOfControllers = [];
		CB.controllers = [];

		CB.includeControllers(CB.LoadControllers);

		for (var i = 0, l = controllers.length - 1; i < l; i++) {
			//load the controller runtime
			controllers[i] = CB.loadController(controllers[i]);
			CB.stackOfControllers.push(controllers[i]);
			//CB.mainView.remove(controllers[i].view);
			controllers[i].view.top = -1000;
			CB.mainView.add(controllers[i].view);
			//controllers[i].view.top = 0;
		}

		CB.pushController(controllers[controllers.length - 1], animate)
		CB.Platform.actInd.hide();
	}
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
	CB.pushController = function(/*Controller*/controller, animate) {

		var previous = (CB.stackOfControllers.length == 0) ? null : CB.stackOfControllers[CB.stackOfControllers.length - 1];

		/*
		 if (previous === null) {
		 controller.view.left = 0;
		 CB.mainView.add(controller.view);
		 return;
		 }*/

		var animationTop = 0;
		var animationLeft = CB.mainView.left - CB.screenWidth;

		//load the controller runtime
		if (!controller.view) {
			controller = CB.loadController(controller);
		}

		if (CB.Plugins._.include(CB.stackOfControllers, controller)) {
			var aIndex = CB.Plugins._.indexOf(CB.stackOfControllers, controller);
			CB.stackOfControllers.splice(aIndex, 1);
		}

		CB.stackOfControllers.push(controller);
		controller.view.top = 0;

		//remove the duplicate view at first
		
		var duplicateView = null;
		if (CB.mainView.children) {
			for (var viewIndex = 0, l = CB.mainView.children.length; viewIndex < l; viewIndex++) {
				if (CB.mainView.children[viewIndex].name == controller.view.name) {
					duplicateView = CB.mainView.children[viewIndex];
					break;
				}
			}
		}

		if (animate === 'none') {
			CB.mainView.layouting(function() {
				controller.base.viewWillAppear(controller);
				controller.view.left = 0;

				if (duplicateView) {
					CB.mainView.remove(duplicateView);
				}
				CB.mainView.add(controller.view);

				if (previous !== null) {
					//CB.mainView.remove(previous.view);
					previous.base.viewWillDisappear(previous);
				}
				controller.base.viewDidAppear(controller);
			});
			//alert('after non :' + CB.mainView.children.length );
			return;
		} else if (animate === 'right') {
			CB.mainView.layouting(function() {
				CB.mainView.width = CB.screenWidth * 2;
				CB.mainView.left = -CB.screenWidth;

				controller.view.left = 0;
				controller.view.top = 0;

				if (duplicateView) {
					CB.mainView.remove(duplicateView);
				}
				CB.mainView.add(controller.view);

				if (previous !== null) {
					previous.view.left = CB.screenWidth;
					previous.base.viewWillDisappear(previous);
				}
				controller.base.viewWillAppear(controller);
			});
			animationLeft = CB.mainView.left + CB.screenWidth;
		} else if (animate === 'up') {
			CB.mainView.layouting(function() {
				CB.mainView.height = CB.screenHeight * 2;
				CB.mainView.top = -CB.screenHeight;

				controller.view.left = 0;

				if (duplicateView) {
					CB.mainView.remove(duplicateView);
				}
				CB.mainView.add(controller.view);

				if (previous !== null) {
					previous.view.top = CB.screenHeight;
					previous.base.viewWillDisappear(previous);
				}
				controller.base.viewWillAppear(controller);
			});
			animationLeft = 0;
			animationTop = CB.mainView.top + CB.screenHeight;
		} else if (animate === 'down') {
			CB.mainView.layouting(function() {
				CB.mainView.height = CB.screenHeight * 2;
				controller.view.top = CB.screenHeight;

				controller.view.left = 0;

				if (duplicateView) {
					CB.mainView.remove(duplicateView);
				}
				CB.mainView.add(controller.view);

				if (previous !== null) {
					previous.base.viewWillDisappear(previous);
				}
				controller.base.viewWillAppear(controller);
			});
			animationLeft = 0;
			animationTop = CB.mainView.top - CB.screenHeight;
		} else {
			CB.mainView.layouting(function() {
				CB.mainView.width = CB.screenWidth * 2;
				controller.view.left = CB.screenWidth;

				if (duplicateView) {
					CB.mainView.remove(duplicateView);
				}
				CB.mainView.add(controller.view);

				if (previous !== null) {
					previous.base.viewWillDisappear(previous);
				}
				controller.base.viewWillAppear(controller);
			});
		}

		CB.mainView.animate({
			duration : CB.changeControllerDuration,
			left : animationLeft,
			top : animationTop,
		}, function() {
			CB.mainView.layouting(function() {
				CB.mainView.left = 0;
				CB.mainView.top = 0;
				CB.mainView.width = CB.screenWidth;
				CB.mainView.height = CB.screenHeight;

				controller.view.left = 0;
				controller.view.top = 0;

				if (previous !== null) {
					//CB.mainView.remove(previous.view);
					previous.base.viewWillDisappear(previous);
				}
				controller.base.viewDidAppear(controller);

				alert('current pages:' + CB.mainView.children.length);
			});
		});

	};

	/**
	 * Pop the controller and back to the previous view
	 */
	CB.popController = function(animate) {
		if (CB.stackOfControllers.length <= 1)
			return;

		var top = CB.stackOfControllers[CB.stackOfControllers.length - 1];
		var previous = CB.stackOfControllers[CB.stackOfControllers.length - 2];
		CB.stackOfControllers.pop();

		CB.mainView.layouting(function() {
			CB.mainView.width = CB.screenWidth * 2;
			CB.mainView.left = -CB.screenWidth;
			top.view.left = CB.screenWidth;

			if (previous !== null) {
				previous.view.left = 0;
				previous.view.top = 0;

				previous.base.viewWillAppear(previous);
			}

			top.base.viewWillDisappear(top);

		});

		if (animate && animate == 'none') {
			CB.mainView.layouting(function() {
				//CB.mainWindow.remove(CB.mainOverlay);

				CB.mainView.remove(top.view);

				CB.mainView.left = 0;
				CB.mainView.width = CB.screenWidth;
				if (previous !== null) {
					//CB.mainView.add(previous.view);
					previous.view.top = 0;
					previous.base.viewDidAppear(previous);
				}

				top.base.viewDidDisappear(top);
			});
		} else {
			CB.mainView.animate({
				duration : CB.changeControllerDuration,
				left : CB.mainView.left + CB.screenWidth,
				top : 0
			}, function() {
				CB.mainView.layouting(function() {

					if (previous !== null) {
						//CB.mainView.add(previous.view);
						previous.view.top = 0;
						previous.base.viewDidAppear(previous);
					}

					CB.mainView.remove(top.view);

					CB.mainView.left = 0;
					CB.mainView.width = CB.screenWidth;
					top.base.viewDidDisappear(top);
					//CB.controllers[top.name] = {name: top.name};
					//alert('pop:' + CB.mainView.children.length);
				});
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
		__exports = {
			viewName : viewName
		};
		Ti.include(path + '.js');
		return __exports;
	};
	
	CB.loadStyle = function(){
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
			CB.Debug.dump(data, 594, 'core.js');
			CB.Debug.dump(tmpObj[data], 595, 'core.js');
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
				CB.Debug.addRefreshBtn(CB, e.view);
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
