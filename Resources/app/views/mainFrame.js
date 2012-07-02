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

__exports = (function() {
	var view = Ti.UI.createView({ 
		backgroundColor: '#000' 
	});
	
	view.mainFrame = Titanium.UI.createView({
		left: -CB.screenWidth,
		top: 0,
		width: CB.screenWidth * 2,
		height: CB.screenHeight
	});
	
	view.add(view.mainFrame);
	
	
	view.mainMenu = Titanium.UI.createView(CB.Styles.menu.mainMenu);
	view.mainFrame.add(view.mainMenu);
	
	view.mainMenu.mainMenuBar = Titanium.UI.createView(CB.Styles.menu.mainMenuBar);
	view.mainMenu.add(view.mainMenu.mainMenuBar);
	
	view.mainMenu.mainMenuBar.menuSelected = Ti.UI.createView(CB.Styles.menu.menuSelected);
	//view.mainMenu.add(view.mainMenu.mainMenuBar.menuSelected);
	
	view.mainMenu.menuBtn = Ti.UI.createButton(CB.Styles.menu.menuBtn);
	view.mainMenu.add(view.mainMenu.menuBtn);
	
	
	
	//menu buttons
	view.mainMenu.mainMenuBar.homeBtn = Ti.UI.createButton(CB.Styles.menu.homeBtn);
	view.mainMenu.add(view.mainMenu.mainMenuBar.homeBtn);
	
	view.mainMenu.mainMenuBar.settingBtn = Ti.UI.createButton(CB.Styles.menu.settingBtn);
	view.mainMenu.add(view.mainMenu.mainMenuBar.settingBtn);
	
	
	
	

	
	return view;
})();
