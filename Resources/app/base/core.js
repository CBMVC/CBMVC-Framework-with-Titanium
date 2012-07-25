/**
 * @file overview This file contains the core framework class CBMVC.
 * @version: 1.0
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
	__controllers : 'mainFrame', //the default main view
	/**
	 * The framework's version
	 */
	Version: '1.0',
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
	Launch : function(controllers, isRefreshSinglePage, animate) {
		//set default language
		CB.Util.setDefaultLang(CB.DefaultLang);
		
		//init the debug mode
		CB.Debug.init(CB.DebugMode.sys);
		
		//init the models
		CB.DB.models.initialize();

		if (isRefreshSinglePage) {
			//just referesh a page(view)
			var currController = CB.stackOfControllers[CB.stackOfControllers.length - 1];
			if (controllers !== 'home' && currController != undefined) {
				CB.mainView.remove(currController.view);
				currController = null;
			}
			CB.stackOfControllers[controllers] = null;
			CB.stackOfControllers.pop();

			controllers = [controllers];
			CB.includeControllers(controllers);
			CB.pushController(CB.controllers[controllers], animate);
		} else {
			if (controllers !== null && controllers !== undefined) {
				__controllers = controllers;
			}

			//reload all pages and return home page
			for (var i = 0, l = CB.stackOfControllers.length; i < l; i++) {
				if (CB.stackOfControllers[i] != undefined) {
					CB.mainView.remove(CB.stackOfControllers[i].view);
					CB.stackOfControllers[i] = null;
					CB.stackOfControllers.pop();
				}
			}
			CB.controllers = [];

			CB.includeControllers(__controllers);
			CB.setRootController(CB.controllers[CB.RootController], animate); 
			CB.openWindow();
		}
	},

	/**
	 * Set the default language
	 */
	DefaultLang : 'en',
	/**
	 * All support languages
	 */
	SupportLanguages : {
		'en' : 'btn-en-lang.png',
		'pt' : 'btn-po-lang.png'
	},
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
	Models : {
		dbName : 'coderblog'
	},
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
	DB : {},
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
	CB.controllers = {};

	CB.screenWidth = Ti.Platform.displayCaps.platformWidth;
	CB.screenHeight = Ti.Platform.displayCaps.platformHeight;
	
	//the menu frame's left
	CB.menuLeft = (CB.screenWidth * 0.07);

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
		
		if (CB.Plugins._.include(CB.stackOfControllers, controller)) {
			var aIndex = CB.Plugins._.indexOf(CB.stackOfControllers, controller);
			CB.stackOfControllers.splice(aIndex, 1);
		}

		var previous = (CB.stackOfControllers.length == 0) ? null : CB.stackOfControllers[CB.stackOfControllers.length - 1];
		CB.stackOfControllers.push(controller);

		controller.view.top = 0;
		
		var animationTop = 0;
		var animationLeft = CB.mainView.left - CB.screenWidth;
		
		//remove existing view at first
		for (var viewIndex in CB.mainView.children) {
			
			if (CB.mainView.children[viewIndex].name == controller.view.name || 
					CB.mainView.children[viewIndex].previous == controller.view.name) {
				var currChildren = CB.mainView.children.length;
				CB.mainView.remove(CB.mainView.children[viewIndex]);
				if(currChildren > 1){
					CB.mainView.children[viewIndex] = null;
				}
			}
		}

		if (animate === 'none') {
			controller.view.left = 0;
			CB.mainView.add(controller.view);

			if (previous !== null) {
				CB.mainView.remove(previous.view);
				previous.base.viewWillDisappear(previous);
			}
			controller.base.viewDidAppear(controller);

			return;
		} else if (animate === 'right') {
			CB.mainView.layouting(function() {
				CB.mainView.width = CB.screenWidth * 2;
				CB.mainView.left = -CB.screenWidth;

				controller.view.left = 0;
				controller.view.top = 0;

				CB.mainView.add(controller.view);
				//CB.mainWindow.add(CB.mainOverlay);

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

				CB.mainView.add(controller.view);
				//CB.mainWindow.add(CB.mainOverlay);

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

				CB.mainView.add(controller.view);
				//CB.mainWindow.add(CB.mainOverlay);

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

				CB.mainView.add(controller.view);
				//CB.mainWindow.add(CB.mainOverlay);

				if (previous !== null) {
					previous.base.viewWillDisappear(previous);
				}
				controller.base.viewWillAppear(controller);
			});
		}
		
		CB.mainView.animate({
			duration : CB.__changeControllerDuration,
			left : animationLeft,
			top : animationTop,
		}, function() {
			CB.mainView.layouting(function() {
				//CB.mainWindow.remove(CB.mainOverlay);

				CB.mainView.left = 0;
				CB.mainView.top = 0;
				CB.mainView.width = CB.screenWidth;
				CB.mainView.height = CB.screenHeight;

				controller.view.left = 0;
				controller.view.top = 0;

				if (previous !== null) {
					CB.mainView.remove(previous.view);
					previous.base.viewWillDisappear(previous);
				}
				controller.base.viewDidAppear(controller);
			});
		});

	};

	/**
	 * Pop the controller and back to the previous view
	 */
	CB.popController = function() {
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

				CB.mainView.add(previous.view);
				previous.base.viewWillAppear(previous);
			}
			//CB.mainWindow.add(CB.mainOverlay);

			top.base.viewWillDisappear(top);

		});

		CB.mainView.animate({
			duration : CB.__changeControllerDuration,
			left : CB.mainView.left + CB.screenWidth,
			top : 0
		}, function() {
			CB.mainView.layouting(function() {
				//CB.mainWindow.remove(CB.mainOverlay);
				CB.mainView.remove(top.view);

				CB.mainView.left = 0;
				CB.mainView.width = CB.screenWidth;
				if (previous !== null) {
					previous.view.left = 0;
					previous.base.viewDidAppear(previous);
				}

				top.base.viewDidDisappear(top);
			});
		});
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
		CB.pushController(controller, animate);
	};

	CB.require = function(path, viewName) {
		__exports = {
			viewName: viewName
		};
		Ti.include(path + '.js');
		return __exports;
	};

	CB.includeControllers = function(names) {

		//reload the styles when refresh the page
		CB.Styles = null;
		//load default style file
		var loadStyle = '/app/styles/styles.js';
		//load difference platform style only
		var styleFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + 'app/styles/' + CB.Platform.osname + '.styles.js');
		if(styleFile.exists()){
			loadStyle = 'app/styles/'+ CB.Platform.osname + '.styles.js';
		}
		Ti.include(loadStyle);

		for (var i = 0; i < names.length; i++) {
			var controllerName = names[i];
			CB.controllers[controllerName] = new CB.Controller(controllerName, CB.require('/app/controllers/' + controllerName));
		}
	};

	CB.Controller = function(name, functions) {
		var self = this;

		this.base = {};
		this.base.viewLoaded = function(e) {
			if (self.viewLoaded !== undefined)
				self.viewLoaded(e);
		};
		this.base.viewWillAppear = function(e) {
			if (self.viewWillAppear !== undefined)
				self.viewWillAppear(e);
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
})();

