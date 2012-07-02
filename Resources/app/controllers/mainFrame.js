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

__exports.viewLoaded = function(e) {
	
	var self = this;
	
	this.view.mainFrame.left = -(CB.screenWidth - (CB.screenWidth * 0.07));
	
	this.view.mainFrame.layouting = function(block) {
		//this.startLayout();
		block();
		//this.finishLayout();
	};
	
	this.view.mainMenu.menuBtn.addEventListener('click', function() {
		CB.controllers.mainFrame.toggleMenu();
	});
	
	this.view.mainMenu.mainMenuBar.addEventListener('click', function() {
		CB.controllers.mainFrame.toggleMenu();
	});
	
	this.view.mainMenu.mainMenuBar.homeBtn.addEventListener('click', function() {
		//CB.controllers.mainFrame.toggleMenu();
		e.view.mainMenu.mainMenuBar.menuSelected.top = CB.Styles.menuSelectedTop.home;
	});
	
	this.view.mainMenu.mainMenuBar.settingBtn.addEventListener('click', function() {
		e.view.mainMenu.mainMenuBar.menuSelected.top = CB.Styles.menuSelectedTop.setting;
	});
	
	this.switchController(CB.controllers.home);
	
	this.view.mainMenu.mainMenuBar.remove(this.view.mainMenu.mainMenuBar.menuSelected);
};

__exports.switchController = function(controller) {
	var self = this;
	var menuLeft = (CB.screenWidth - (CB.screenWidth * 0.07));

	if (this.controller === undefined) {
		this.controller = controller;
		this.view.mainFrame.layouting(function() {
			self.controller.view.left = CB.screenWidth;
			self.view.mainFrame.add(self.controller.view);
		});
		return;
	}
	
	var previous = this.controller;
	this.controller = controller;

	this.view.mainFrame.animate({
		duration: CB.changeControllerDuration,
		left:0,
		top: 0
	}, function() {
		self.view.mainFrame.layouting(function() {
			self.view.mainFrame.left = 0;
			self.controller.view.left = -menuLeft;
			
			self.view.mainFrame.remove(previous.view);
			self.view.mainFrame.add(self.controller.view);
		});
		
		self.view.mainFrame.animate({
			duration: CB.changeControllerDuration,
			left: -menuLeft,
			top: 0
		}, function() {
			self.view.mainFrame.left = -menuLeft;
		});
	});
};


__exports.isMenuOpen = function() {
	return (this.view.mainFrame.left == -(CB.screenWidth - (CB.screenWidth * 0.07)));
}

__exports.toggleMenu = function(block) {
	if (this.isMenuOpen()) {
		this.openMenu(block);
	} else {
		this.closeMenu(block);
	}
};
	
__exports.closeMenu = function(block) {
	var self = this;
	self.view.mainMenu.remove(self.view.mainMenu.mainMenuBar.menuSelected);
	self.view.mainMenu.menuBtn.backgroundImage = CB.Styles.imagePath + 'menu-btn-right.png';
	
	this.view.mainFrame.animate({
		duration: CB.changeControllerDuration,
		left: - (CB.screenWidth - (CB.screenWidth * 0.07)),
		top: 0
	}, function() {
		self.view.mainFrame.left = -(CB.screenWidth - (CB.screenWidth * 0.07));
		
		if (block !== undefined) block();
	});
};
	
__exports.openMenu = function(block) {
	var self = this;
	self.view.mainMenu.add(self.view.mainMenu.mainMenuBar.menuSelected);
	self.view.mainMenu.menuBtn.backgroundImage = CB.Styles.imagePath + 'menu-btn-left.png';
	
	this.view.mainFrame.animate({
		duration: CB.changeControllerDuration,
		left: - (CB.screenWidth - (CB.screenWidth * 0.2)),
		top: 0
	}, function() {
		self.view.mainFrame.left = -(CB.screenWidth - (CB.screenWidth * 0.2));
			
		if (block !== undefined) block();
	});
};