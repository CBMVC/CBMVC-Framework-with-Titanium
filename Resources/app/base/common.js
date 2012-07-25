/**
 * @file overview This file contains the core framework class CBMVC.
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
 * Common functions for all controllers and views
 */
CB.Common = {
	UI : {
		/**
		 * Create a dropdown list within a web view 
		 * @param {Object} view, which view need to add the dropdown list object
		 * 
		 * view.ddlArgs = {
		 * 	id : ddl object id,
		 *  innerFontSize: webview ddl font size(default is 12),
		 *  top: ddl top,
		 *  left: ddl left,
		 *  width: ddl width,
		 *  height: ddl height,
		 *  items :[
		 * 		//'the ddl option items'
		 * 		{text:'test', value:1}
		 * 	],
		 *  callback : the call back function
		 * }
		 */
		createDropDownList : function(view){
			var html = "<html><head>"+
						"<meta name='viewport' content='user-scalable=0, initial-scale=1, maximum-scale=1, minimum-scale=1'>"+
						"</head><body style='background-color:transparent ;margin:0;padding:0'>";
				html += "<select id='{0}' style='width:100%; height:100%;font-size: {1}px; '>";
				for(var itemIndex in view.ddlArgs.items){
					html += "<option value='{0}' {1}>{2}</option>".format(view.ddlArgs.items[itemIndex].value,
																		  view.ddlArgs.items[itemIndex].selected, 
																		  view.ddlArgs.items[itemIndex].text);
				}
				html += "</select>";
				html += "<script type='text/javascript'>";
				html += "document.getElementById('{0}').onchange = function(){ Titanium.App.fireEvent('app:set{0}',{value:this.value}); };";
				html += "</script>";
				html += "</body></html>";
				
			
			html = html.format(view.ddlArgs.id, 
							   view.ddlArgs.innerFontSize == undefined ? '12' : view.ddlArgs.innerFontSize);
			
			if(view.ddlArgs.height == null || view.ddlArgs.height == undefined){
				view.ddlArgs.height = CB.screenHeight * 0.055;
			}
			view[view.ddlArgs.id + 'DropDown'] = Ti.UI.createWebView({
				top : view.ddlArgs.top,
				left : view.ddlArgs.left,
				width : view.ddlArgs.width,
				height : view.ddlArgs.height,
				scalesPageToFit:true,
				html : html
			});
			
			view.add(view[view.ddlArgs.id + 'DropDown']);
			
			
			Ti.App.addEventListener("app:set" + view.ddlArgs.id, function(e) {
				view.ddlArgs.callback(e);
			});
				
		},
		/**
		 * Create base with a left menu.
		 * return the view and there are two sub view in it:
		 * view.mainFrame : this is the menu layout view
		 * view.contentView : this is a view of layout element, you must add all element within this view
		 * 
		 * @param {String} viewName
		 */
		createBaseViewWithMenu : function(viewName) {
			var mainView = Ti.UI.createView();
			
			mainView.mainFrame = Ti.UI.createView(CB.Styles.menu.mainFrame);
			mainView.add(mainView.mainFrame);
			
			mainView.contentView = Ti.UI.createView(CB.Styles.common.baseView);
			mainView.name = viewName;
			mainView.mainFrame.add(mainView.contentView);

			//menu layout
			mainView.mainFrame.mainMenu = Titanium.UI.createView(CB.Styles.menu.mainMenu);
			mainView.mainFrame.add(mainView.mainFrame.mainMenu);

			mainView.mainFrame.mainMenu.mainMenuBar = Titanium.UI.createView(CB.Styles.menu.mainMenuBar);
			mainView.mainFrame.mainMenu.add(mainView.mainFrame.mainMenu.mainMenuBar);

			mainView.mainFrame.mainMenu.mainMenuBar.menuSelected = Ti.UI.createView(CB.Styles.menu.menuSelected);

			mainView.mainFrame.mainMenu.menuBtn = Ti.UI.createButton(CB.Styles.menu.menuBtn);
			mainView.mainFrame.mainMenu.add(mainView.mainFrame.mainMenu.menuBtn);

			//menu buttons
			mainView.mainFrame.mainMenu.mainMenuBar.homeBtn = Ti.UI.createButton(CB.Styles.menu.homeBtn);
			mainView.mainFrame.mainMenu.add(mainView.mainFrame.mainMenu.mainMenuBar.homeBtn);

			mainView.mainFrame.mainMenu.mainMenuBar.settingBtn = Ti.UI.createButton(CB.Styles.menu.settingBtn);
			mainView.mainFrame.mainMenu.add(mainView.mainFrame.mainMenu.mainMenuBar.settingBtn);


			//menu events
			mainView.mainFrame.addEventListener('click', function(e) {
				CB.Debug.dump(e.source, 98, 'common.js');
				//just click on the view
				if (e.source != undefined) {
					CB.Common.toggleMenu(mainView.mainFrame);
				}
			});

			mainView.mainFrame.mainMenu.menuBtn.addEventListener('click', function() {
				CB.Common.toggleMenu(mainView.mainFrame);
			});

			mainView.mainFrame.mainMenu.mainMenuBar.addEventListener('click', function() {
				CB.Common.toggleMenu(mainView.mainFrame);
			});

			mainView.mainFrame.mainMenu.mainMenuBar.homeBtn.addEventListener('click', function() {
				//CB.controllers.mainFrame.toggleMenu();
				CB.Launch(null, null, 'left');
			});

			mainView.mainFrame.mainMenu.mainMenuBar.settingBtn.addEventListener('click', function() {
				CB.pushController(CB.controllers.setting);
			});

			//this.setCurrMenu(mainView);
			return mainView;
		}
	},
	/**
	 * User login function
	 * @param {String} userId, login user id
	 * @param {String} userPassword, alert box title
	 * @param {Object} controller, the controller should be redirect after login success
	 */
	login : function(userId, userPassword, controller) {
		//call api for login checking
		var ajaxObj = {
			timeout : CB.API.timeout,
			type : 'GET',
			data : {
				debug : CB.DebugMode.api,
				user_id : userId,
				user_password : userPassword
			},
			url : CB.API.login.value,
			onerror : function(d) {
				CB.Debug.dump(d, 167, 'base/common.js');
				alert(CB.Util.L('unknowError'));
				CB.Platform.actInd.hide();
			},
			callback : function(d) {
				CB.Debug.dump(d.login.response_details, 172, 'base/common.js');
				CB.Platform.actInd.hide();

				if (d.login.response_details != undefined) {
					var status = d.login.response_details.status;
					CB.API.loginErrorHandle(status);

				} else {
					CB.Util.alert(CB.Util.L('unknowError'), CB.Util.L('error'));
				}
			}
		}
		CB.Platform.actInd.show();
		CB.Ajax.request(ajaxObj);
	},
	/**
	 * Get date with remote API function
	 * @param {Object} api: the API which need to call 
 	 * @param {Object} callback function
 	 * @param {Object} requestData: the data need to be pass to server (except user session_id and user_key)
	 */
	remoteAPIData : function(api, callback, requestData) {
		//check login at first if need
		//var user = CB.Util.loadObject('user');
		
		//if (user != null) {	
			//CB.Platform.actInd.show();
			//get data from local storage at first, otherwise get from remote server
			var remoteData = CB.Util.loadObject(api.name);
			if(api.saveData && remoteData != null){
				CB.Debug.dump(remoteData, 218, 'base/common.js');
				callback(remoteData);
			}else{
				var ajaxObj = {
					type : 'GET',
					//common data pass to server
					/*
					data : {
						debug : CB.DebugMode.api,
						session_id : user.sessionId,
						user_key : user.user_key
					},*/
					url : api.value,
					onerror : function(d) {
						CB.Debug.dump(d, 232, 'base/common.js');
						//CB.Platform.actInd.hide();
						CB.Util.alert(CB.Util.L('unknowError'),CB.Util.L('error'));
					},
					callback : function(d) {		
						//the return data format should be match with the api name, like follow:
						/*
						   {
							  "api_name": {
							    "request_details": {
							      "debug": "x",
							      "session_id": "x",
							      "user_key": "x",
							    },
							    "response_details": {
							      "status": "x",
							    }
							  }
							}
						 */
						var result = d[api.name].response_details;
						CB.Debug.dump(d, 200, 'base/common.js');	
						if(result.status == '0' && api.saveData){			
							//CB.Util.removeObject(api.name);						
					 		CB.Util.saveObject(api.name, result);
					 	}
						
						//CB.Platform.actInd.hide();
						
						callback(result);
						
						//reset the object when there is an error
						/*
						if (result.status == '1' || result.status == '2') {
							CB.Util.removeObject('user');
							if(api.saveData){	
								CB.Util.removeObject(api.name);
							}
						}*/
						
						//common errors handler
						CB.API.errorHandle(result.status);
					}
				}
				if(requestData != undefined){
					CB.Platform.extend(ajaxObj.data, requestData);
				}
	
				CB.Debug.dump(ajaxObj,263, 'base/common.js');
				
				CB.Ajax.request(ajaxObj);
			}
		/*
		} else {
			CB.Util.removeObject('user');
			if(api.saveData){
				CB.Util.removeObject(api.name);
			}
			CB.Util.alert(CB.Util.L('timeout'), CB.Util.L('error'));
			CB.Launch(CB.RootController, false, 'right');
		}*/
	},
	/**
	 * Common view header
	 * @param {Object} view
	 */
	viewHeader : function(view) {
		//common layout functions and elements within header
	},
	/**
	 * Common view foter
	 * @param {Object} view
	 */
	viewFooter : function(view) {
		//common layout functions and elements within footer
	},

	
	setCurrMenu : function(mainView, currMenu) {
		mainView.mainMenu.mainMenuBar.menuSelected.top = currMenu;
		CB.Util.saveObject('currMenu', currMenu);
	},
	showCurrMenu : function(mainView) {
		var currMenu = CB.Util.loadObject('currMenu');
		if (currMenu == undefined) {
			currMenu = CB.Styles.menuSelectedTop.home;
		}
		mainView.mainMenu.mainMenuBar.menuSelected.top = currMenu;
	},
	isMenuOpen : function(mainView) {
		return (mainView.left == -CB.screenWidth);
	},
	toggleMenu : function(mainView, block) {
		if (this.isMenuOpen(mainView)) {
			this.openMenu(mainView, block);
		} else {
			this.closeMenu(mainView, block);
		}
	},
	closeMenu : function(mainView, block) {
		mainView.mainMenu.remove(mainView.mainMenu.mainMenuBar.menuSelected);
		mainView.mainMenu.menuBtn.backgroundImage = CB.Styles.imagePath + 'menu-btn-right.png';

		mainView.animate({
			duration : CB.__changeControllerDuration,
			left : -CB.screenWidth,
			top : 0
		}, function() {
			mainView.left = -CB.screenWidth;

			if (block !== undefined)
				block();
		});
	},
	openMenu : function(mainView, block) {
		mainView.mainMenu.add(mainView.mainMenu.mainMenuBar.menuSelected);
		mainView.mainMenu.menuBtn.backgroundImage = CB.Styles.imagePath + 'menu-btn-left.png';

		mainView.animate({
			duration : CB.__changeControllerDuration,
			left : -CB.screenWidth + (CB.screenWidth * 0.13),
			top : 0
		}, function() {
			mainView.left = -CB.screenWidth + (CB.screenWidth * 0.13);
			if (block !== undefined)
				block();
		});
	}
}
