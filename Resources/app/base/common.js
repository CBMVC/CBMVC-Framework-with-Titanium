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
		createDropDownList : function(view) {

			var html = "<html><head>" + "<meta name='viewport' content='user-scalable=0, initial-scale=1, maximum-scale=1, minimum-scale=1'>" + "</head><body style='background-color:transparent ;margin:0;padding:0'>";
			html += "<select id='{0}' style='width:100%; height:100%;font-size: {1}px; '>";
			for (var itemIndex in view.ddlArgs.items) {
				html += "<option value='{0}' {1}><span style='font-size:8px'>{2}</span></option>".format(view.ddlArgs.items[itemIndex].value, view.ddlArgs.items[itemIndex].selected, view.ddlArgs.items[itemIndex].text);
			}
			html += "</select>";
			html += "<script type='text/javascript'>";
			html += "document.getElementById('{0}').onchange = function(){ Titanium.App.fireEvent('app:set{0}',{value:this.value}); };";
			html += "</script>";
			html += "</body></html>";

			html = html.format(view.ddlArgs.id, view.ddlArgs.innerFontSize == undefined ? '12' : view.ddlArgs.innerFontSize);
			if(view.ddlArgs.top == null && CB.Platform.isAndroid()){
				view.ddlArgs.top = '10dp';
			}
			/*
			 if (view.ddlArgs.height == null || view.ddlArgs.height == undefined) {
			 view.ddlArgs.height = CB.screenHeight * 0.055;
			 }*/
			view[view.ddlArgs.id + 'DropDown'] = Ti.UI.createWebView({
				top : view.ddlArgs.top,
				left : view.ddlArgs.left,
				width : view.ddlArgs.width,
				height : CB.screenHeight * 0.055,
				scalesPageToFit : true,
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
		},
		/**
		 * Create a date picker
		 * @param {Object} field, a input field for trigger the date picker select event
		 * @param {Object} view, the view for add to the date picker
		 * @param {Function} callback, a callback function
		 */
		createDatePicker : function(viewForSelect, viewForPicker, callback) {
			var field = viewForSelect.selectDate;
			var picker = {};
			CB.Util.date.format.masks.selectDate = 'yyyy-m-dd';
			var isAndroid = CB.Platform.isAndroid();

			var flex_space = Ti.UI.createButton({
				systemButton : Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
			});

			picker.picker_close = function() {
				viewForPicker.remove(picker.picker_view);
				/*
				view.content.selectDateRow.animate({
				duration : 250,
				height : CB.screenHeight * 0.11
				});
				*/
				//viewForPicker.height = CB.screenHeight * 0.1;
				viewForPicker.height = "0%";
				//picker.picker_view.animate(animation);
			};

			/*
			 for(var i in picker_rows) {
			 picker.picker.add(Ti.UI.createPickerRow({
			 title : picker_rows[i].title,
			 value : picker_rows[i].value
			 }));
			 }*/

			picker.picker_cancel = Ti.UI.createButton({
				title : 'Cancel',
				style : Ti.UI.iPhone.SystemButtonStyle.BORDERED,
				left : 0,
				top : 0
			});
			picker.picker_cancel.addEventListener('click', picker.picker_close);

			picker.picker_done = Ti.UI.createButton({
				title : 'Done',
				style : Ti.UI.iPhone.SystemButtonStyle.DONE,
				right : 0,
				top : 0
			});
			picker.picker_done.addEventListener('click', function() {
				//CB.Debug.dump(picker.picker.value, 95, 'meterReading');
				picker.picker_close();
				field.value = picker.picker.value.format("selectDate");
				field.picker_value = picker.picker.value.format("selectDate");
				field.blur();
				callback(field.value);
			});

			picker.picker = Ti.UI.createPicker({
				selectionIndicator : true,
				top : '43dp',
				useSpinner : true,
				//visibleItems : 7,
				value : new Date(),
				type : Ti.UI.PICKER_TYPE_DATE
			});

			picker.picker_view = Ti.UI.createView({
				//height:CB.screenHeight * 0.7,
				//top : '50dp'
			});

			if (!isAndroid) {
				picker.picker_toolbar = Ti.UI.createToolbar({
					top : 0,
					//bottom : picker.picker.height,
					items : [picker.picker_cancel, flex_space, picker.picker_done],
					barColor : 'transparent'
				});
				picker.picker_view.add(picker.picker_toolbar);
			} else {
				picker.picker.setLocale('zh');
			}

			picker.picker_view.add(picker.picker);

			picker.picker.addEventListener('change', function() {
				//CB.Debug.dump(picker.picker.value, 146, 'meterreading');
			});

			var keyboard_close = Ti.UI.createTextField({
				backgroundColor : 'transparent',
				width : 0,
				height : 0,
				enabled : false
			});
			keyboard_close.addEventListener('focus', function() {
				this.blur();
			});
			picker.picker_view.add(keyboard_close);
			//view.content.selectDateRow.add(picker.picker_view);

			picker.clickCalendar = function() {
				if (isAndroid) {

					picker.picker.showDatePickerDialog({
						callback : function(de) {
							if (!de.cancel) {
								//CB.Debug.dump(de.value,206,'meterread');
								field.value = de.value.format("selectDate");
							}
							field.blur();
							callback(field.value);
						}
					});
				} else {
					//view.content.selectDateRow.startLayout();
					/*
					 view.content.selectDateRow.animate({
					 duration : 350,
					 height : CB.screenHeight * 0.7
					 });
					 */
					viewForPicker.height = CB.screenHeight * 0.54;
					viewForPicker.add(picker.picker_view);
					CB.Debug.echo('======focus date picker=======', 171, 'meterReading');
					keyboard_close.focus();
					picker.picker_toolbar.bottom = picker.picker.height;
					//view.content.selectDateRow.finishLayout();
				}
			}

			field.addEventListener('focus', function() {
				picker.clickCalendar();
			});
			var picker_carret = Ti.UI.createImageView({
				//image : Ti.Utils.base64decode('iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAL1JREFUeNrs0d0Jg0AQReG1kpRgK3Yo6SwdWEKyDwo+aND9nTueAxcW5uljQyAiIiIiIiIiIvGG3XuMm5w6P3Hvo8Mc93W2Zf3M0+YnYT2hL2M9oG9jldHJWEV0NlYJXQyrgC6OtYyuhrWIro61hG6GtYBuju2J7obtge6ObYk2g22BNoetiTaLrYE2jy2JlsGWQMthc9Cy2BS0PPYO2g32Ctod9h/aLfYI7R67Rz8Gu/UKREREREQk00+AAQC65exwO9Ys1wAAAABJRU5ErkJggg=='),
				image : CB.Styles.imagePath + 'calendar.png',
				hires : true,
				width : '20dp',
				height : '20dp',
				left : '88%',
				top : '16dp',
				//touchEnabled : false
			});
			picker_carret.addEventListener('click', function() {
				picker.clickCalendar();
			});
			viewForSelect.add(picker_carret);

			return picker;
		},

		/**
		 * Create a date picker
		 * @param {Object} field, a input field for trigger the date picker select event
		 * @param {Object} view, the view for add to the date picker
		 * @param {Function} callback, a callback function
		 */
		createPicker : function(view, picker_rows) {
			var picker = {};

			var isAndroid = false;
			if (Ti.Platform.name == 'android') {
				isAndroid = true;
			}

			var flex_space = Ti.UI.createButton({
				systemButton : Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
			});

			picker.picker_close = function() {
				var animation = Ti.UI.createAnimation({
					bottom : -259
				});
				animation.addEventListener('complete', function() {
					picker.picker_view.close();
				});
				picker.picker_view.animate(animation);
			};

			picker.picker = Ti.UI.createPicker({
				selectionIndicator : true,
				bottom : 0,
				//useSpinner : true,
				visibleItems : 7,
				type : Ti.UI.PICKER_TYPE_PLAIN
			});
			for (var i in picker_rows) {
				picker.picker.row = Ti.UI.createPickerRow({
					title : picker_rows[i].title,
					value : picker_rows[i].value,
					index : i
				});
    
			  picker.picker.rowLabel = Ti.UI.createLabel({
			    color:'red',
			    font:{fontSize:'12dp',fontWeight:'bold'},
			    text: picker_rows[i].title,
			    textAlign:'left',
			    height:'auto',
			    width:'126'
			  });
			  
			  picker.picker.row.add(picker.picker.rowLabel );
			  picker.picker.add(picker.picker.row);
			  	/*
				picker.picker.add(Ti.UI.createPickerRow({
					title : picker_rows[i].title,
					value : picker_rows[i].value,
					index : i
				}));
				*/
			}

			picker.picker_cancel = Ti.UI.createButton({
				title : 'Cancel',
				style : Ti.UI.iPhone.SystemButtonStyle.BORDERED,
				left : 0,
				top : 0
			});
			picker.picker_cancel.addEventListener('click', picker.picker_close);

			picker.picker_done = Ti.UI.createButton({
				title : 'Done',
				style : Ti.UI.iPhone.SystemButtonStyle.DONE,
				right : 0,
				top : 0
			});
			picker.picker_done.addEventListener('click', function() {
				picker.picker_close();
				view.pickerField.title = picker.picker.getSelectedRow(0).title;
				view.pickerField.value = picker.picker.getSelectedRow(0).value;
				view.pickerField.picker_index = picker.picker.getSelectedRow(0).index;
			});
			if (isAndroid) {
				picker.picker_toolbar = Ti.UI.createView({
					height : '202dp',
					bottom : 0,
					backgroundColor : 'gray'
				});
				picker.picker_toolbar.add(Ti.UI.createView({
					height : '44dp',
					top : 0,
					backgroundColor : 'darkGray'
				}));
				picker.picker_toolbar.add(picker.picker_cancel);
				picker.picker_toolbar.add(picker.picker_done);
			} else {
				picker.picker_toolbar = Ti.UI.createToolbar({
					bottom : picker.picker.height,
					items : [picker.picker_cancel, flex_space, picker.picker_done],
					barColor : 'transparent'
				});
			}

			picker.picker_view = Ti.UI.createWindow({
				bottom : -259
			});
			picker.picker_view.add(picker.picker_toolbar);
			picker.picker_view.add(picker.picker);

			var keyboard_close = Ti.UI.createTextField({
				backgroundColor : 'transparent',
				width : 0,
				height : 0,
				enabled : false
			});
			keyboard_close.addEventListener('focus', function() {
				this.blur();
			});
			view.add(keyboard_close);

			view.pickerField.addEventListener('click', function() {
				
				keyboard_close.focus();
				picker.picker_toolbar.bottom = picker.picker.height;
				picker.picker_view.open();
				picker.picker_view.addEventListener('open', function() {
					picker.picker.setSelectedRow(0, Number(view.pickerField.picker_index), false);
				})
				picker.picker_view.animate({
					bottom : 0
				});
			});
			var picker_carret = Ti.UI.createImageView({
				image : Ti.Utils.base64decode('iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAL1JREFUeNrs0d0Jg0AQReG1kpRgK3Yo6SwdWEKyDwo+aND9nTueAxcW5uljQyAiIiIiIiIiIvGG3XuMm5w6P3Hvo8Mc93W2Zf3M0+YnYT2hL2M9oG9jldHJWEV0NlYJXQyrgC6OtYyuhrWIro61hG6GtYBuju2J7obtge6ObYk2g22BNoetiTaLrYE2jy2JlsGWQMthc9Cy2BS0PPYO2g32Ctod9h/aLfYI7R67Rz8Gu/UKREREREQk00+AAQC65exwO9Ys1wAAAABJRU5ErkJggg=='),
				hires : true,
				width : '20dp',
				height : '20dp',
				opacity : 0.5,
				right : '10dp',
				touchEnabled : false
			});
			view.pickerField.add(picker_carret);

			return picker;
		},

		/**
		 * Create and show a popup modal window
		 * @param {Object} view, the view with popup window parameter and elements
		 * @param {int} winHeight, height of the popup window, null for full screen
		 * @param {int} winWidth, width of the popup window, null for full screen
		 */
		createPopupWin : function(view, winHeight, winWidth) {
			if (!winHeight) {
				winHeight = CB.screenHeight * 0.90;
			}
			if (!winWidth) {
				winWidth = CB.screenWidth * 0.90;
			}
			
			view.popBgView = Titanium.UI.createView({
				backgroundColor : '#000',
				height : view.height,
				width : view.width,
				opacity : 0.8
			});
			view.add(view.popBgView);
			
			view.popWin = Titanium.UI.createWindow({
				//backgroundColor : '#fff',
				//opacity : 0.8
			});
			
			
			view.popWin.popView = Titanium.UI.createView({
				borderWidth : 8,
				borderColor : '#999',
				height : winHeight,
				width : winWidth,
				borderRadius : 10,
				backgroundColor: '#fff'
			});
			
			if (CB.Platform.isAndroid()) {
				view.popWin.add(view.popWin.popView);
				view.popWin.open({
					animate : true
				});
				view.popWin.popView.addEventListener('postlayout', function(e) { // not called ...
					CB.Common.UI.createCloseButton(view);
				});
			} else {
				var t = Titanium.UI.create2DMatrix();
				t = t.scale(0);

				view.popWin.transform = t;

				// create first transform to go beyond normal size
				var t1 = Titanium.UI.create2DMatrix();
				t1 = t1.scale(1.1);
				var a = Titanium.UI.createAnimation();
				a.transform = t1;
				a.duration = 200;

				// when this animation completes, scale to normal size
				a.addEventListener('complete', function() {
					Titanium.API.info('here in complete');
					var t2 = Titanium.UI.create2DMatrix();
					t2 = t2.scale(1.0);
					view.popWin.animate({
						transform : t2,
						duration : 200
					});
					
					CB.Common.UI.createCloseButton(view);
				});

				view.popWin.add(view.popWin.popView);
				view.popWin.open(a);
				
			}
			
			return view.popWin.popView;
		},
		
		createCloseButton : function(view) {
			view.popWin.popCloseBtn = Ti.UI.createButton(CB.Styles.common.popCloseBtn);
			
		  	Ti.API.info(view.popWin.popView.rect.height);
		  	view.popWin.popView.removeEventListener('postlayout', function(){});
		  	//view.popWin.popCloseBtn.center = {x:(CB.screenWidth-view.popWin.popView.width)/2,y:(CB.screenHeight-view.popWin.popView.rect.height)/2};
		  	view.popWin.popCloseBtn.center = {x:view.popWin.popView.rect.x,y:view.popWin.popView.rect.y+CB.screenHeight*0.01};
		
			
			view.popWin.popCloseBtn.addEventListener('click', function() {
				CB.Common.UI.closePopupWin(view);
			});
			view.popWin.add(view.popWin.popCloseBtn);
		},
		
		/**
		 * Close the popup window 
		 */
		closePopupWin: function(view){
			view.remove(view.popBgView);
			if (CB.Platform.isAndroid()) {
					view.popWin.popCloseBtn.hide();
					view.popWin.close({
						animate : true
					});
				} else {
					var t3 = Titanium.UI.create2DMatrix();
					t3 = t3.scale(0);
					view.popWin.close({
						transform : t3,
						duration : 300
					});
				}
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
