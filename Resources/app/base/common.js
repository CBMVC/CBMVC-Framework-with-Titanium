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
			url : CB.API.login,
			onerror : function(d) {
				CB.Debug.dump(d, 23, 'base/common.js');
				alert(CB.Util.L('unknowError'));
				CB.Platform.actInd.hide();
			},
			callback : function(d) {
				CB.Debug.dump(d.login.response_details, 28, 'base/common.js');
				CB.Platform.actInd.hide();

				if (d.login.response_details != undefined) {
					var status = d.login.response_details.status;
					switch(status) {
						case '1':
							CB.Util.alert(CB.Util.L('invalidUser'), CB.Util.L('error'));
							break;
						case '2':
							CB.Util.alert(CB.Util.L('wrongPassword'), CB.Util.L('error'));
							break;
						case '0':
							CB.Models.User.sessionId = d.login.response_details.session_id;
							CB.Models.User.user_key = d.login.response_details.user_key;
							CB.Util.saveObject('user', CB.Models.User);
							CB.Common.getRemoteData('info', controller, true);
							break;
						default:
							CB.Util.alert(CB.Util.L('unknowError'), CB.Util.L('error'));
							break;
					}

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
	 * @param {String} api, the API's name
	 * @param {Object} controller, which controller need to show after got data
	 * @param {Boolean} saveData, save response data to local storage or just pass data to next view
	 * 					true, save in local storage
	 * 					false, just pass data to controller.model to next view
	 * @param {String} animate
	 */
	getRemoteData : function(api, controller, saveData, animate) {
		//get login user
		var user = CB.Util.loadObject('user');

		if (user != null) {

			var ajaxObj = {
				timeout : CB.API.timeout,
				type : 'GET',
				data : {
					debug : CB.DebugMode.api,
					session_id : user.sessionId,
					user_key : user.user_key
				},
				url : CB.API[api],
				onerror : function(d) {
					CB.Debug.dump(d, 81, 'base/common.js');
					CB.Util.alert(CB.Util.L('unknowError'), CB.Util.L('error'));
				},
				callback : function(d) {
					CB.Debug.dump(d, 85, 'base/common.js');
					var result = d[api].response_details;
					if (result.status == '0') {
						if (saveData) {
							CB.Util.removeObject(api);
							CB.Util.saveObject(api, result);
						} else {
							controller.model = result;
						}
						CB.pushController(controller, animate);
					} else {
						CB.Util.removeObject('user');
						if (saveData) {
							CB.Util.removeObject(api);
						}
						CB.Util.alert(CB.Util.L('timeout'), CB.Util.L('error'));
						CB.Launch(null, null, 'right');
					}
				}
			}
			CB.Ajax.request(ajaxObj);
		} else {
			CB.Util.removeObject('user');
			if (saveData) {
				CB.Util.removeObject(api);
			}
			CB.Util.alert(CB.Util.L('timeout'), CB.Util.L('error'));
			CB.Launch(null, null, 'right');
		}
	},
	/**
	 * Common view header
	 * @param {Object} view
	 */
	viewHeader : function(view) {

	},
	/**
	 * Common view bottom bar
	 * @param {Object} view
	 */
	viewBottomBar : function(view) {

	},
	/**
	 * Add a left menu within the view
 	 * @param {Object} mainView
	 */
	addMenu : function(mainView) {
		
		mainView.mainFrame = Titanium.UI.createView(CB.Styles.menu.mainFrame);
		mainView.mainFrame.left = CB.menuLeft;
		
		mainView.add(mainView.mainFrame);
		
		//menu layout
		mainView.mainMenu = Titanium.UI.createView(CB.Styles.menu.mainMenu);
		mainView.mainFrame.add(mainView.mainMenu);

		mainView.mainMenu.mainMenuBar = Titanium.UI.createView(CB.Styles.menu.mainMenuBar);
		mainView.mainMenu.add(mainView.mainMenu.mainMenuBar);

		mainView.mainMenu.mainMenuBar.menuSelected = Ti.UI.createView(CB.Styles.menu.menuSelected);

		mainView.mainMenu.menuBtn = Ti.UI.createButton(CB.Styles.menu.menuBtn);
		mainView.mainMenu.add(mainView.mainMenu.menuBtn);

		//menu buttons
		mainView.mainMenu.mainMenuBar.homeBtn = Ti.UI.createButton(CB.Styles.menu.homeBtn);
		mainView.mainMenu.add(mainView.mainMenu.mainMenuBar.homeBtn);

		mainView.mainMenu.mainMenuBar.settingBtn = Ti.UI.createButton(CB.Styles.menu.settingBtn);
		mainView.mainMenu.add(mainView.mainMenu.mainMenuBar.settingBtn);
		
		mainView.left = CB.menuLeft;
		
		//menu events
		mainView.addEventListener('click', function(e) {
			CB.Debug.dump(e.source);
			//just click on the view
			if(e.source.mainFrame != undefined){
				CB.Common.toggleMenu(mainView);
			}
		});
		
		mainView.mainMenu.menuBtn.addEventListener('click', function() {
			CB.Common.toggleMenu(mainView);
		});
		
		mainView.mainMenu.mainMenuBar.addEventListener('click', function() {
			CB.Common.toggleMenu(mainView);
		});
		
		mainView.mainMenu.mainMenuBar.homeBtn.addEventListener('click', function() {
			//CB.controllers.mainFrame.toggleMenu();
			CB.Launch(null, null, 'left');
		});
		
		mainView.mainMenu.mainMenuBar.settingBtn.addEventListener('click', function() {
			CB.pushController(CB.controllers.setting);
		});
		
		this.setCurrMenu(mainView);
	},
	setCurrMenu: function(mainView, currMenu){
		mainView.mainMenu.mainMenuBar.menuSelected.top = currMenu;
		CB.Util.saveObject('currMenu',currMenu);
	},
	showCurrMenu : function(mainView){
		var currMenu = CB.Util.loadObject('currMenu');
		if(currMenu == undefined){
			currMenu = CB.Styles.menuSelectedTop.home;
		}
		mainView.mainMenu.mainMenuBar.menuSelected.top = currMenu;
	},
	isMenuOpen : function(mainView) {
		return (mainView.mainFrame.left == CB.menuLeft);
	},
	toggleMenu : function(mainView,block) {
		if (this.isMenuOpen(mainView)) {
			this.openMenu(mainView, block);
		} else {
			this.closeMenu(mainView, block);
		}
	},
	closeMenu : function(mainView, block) {
		
		mainView.mainMenu.remove(mainView.mainMenu.mainMenuBar.menuSelected);
		mainView.mainMenu.menuBtn.backgroundImage = CB.Styles.imagePath + 'menu-btn-right.png';

		mainView.mainFrame.animate({
			duration : CB.__changeControllerDuration,
			left : CB.menuLeft,
			top : 0
		}, function() {
			mainView.mainFrame.left = CB.menuLeft;

			if (block !== undefined)
				block();
		});
	},
	openMenu : function(mainView, block) {

		mainView.mainMenu.add(mainView.mainMenu.mainMenuBar.menuSelected);
		mainView.mainMenu.menuBtn.backgroundImage = CB.Styles.imagePath + 'menu-btn-left.png';

		mainView.mainFrame.animate({
			duration : CB.__changeControllerDuration,
			left : -(CB.screenWidth - (CB.screenWidth * 0.2)),
			top : 0
		}, function() {
			mainView.mainFrame.left = -(CB.screenWidth - (CB.screenWidth * 0.2));

			if (block !== undefined)
				block();
		});
	}
}
