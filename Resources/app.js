/**
 * @file overview This file contains the core framework class CBMVC (CB == Coder Blog).
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

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

Ti.include('/app/base/core.js');

CB.AppName = 'Coder Blog';

//set the default language with the app
CB.DefaultLang = 'en';

//set the debug mode
CB.DebugMode = {
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
			mode : 2,
			/**
			 * debug type, support Titanium debug type:
		 	 * info: display message with [INFO] style in console (default)
		 	 * warn: display message with [WARN] style in console 
		 	 * error: display message with [ERROR] style in console
			 */
			msgType: 'info'
			
		},
		/**
		 * style debug mode
		 * true: enable debug mode, will add the border Width and color with the element of layout
		 * false: disable debug mode
		 */
		style: false,
		/**
		 * api debug mode, base on your api server
		 * 'Y': disable encrypt all value of request details and response details 
		 * 'N': encrypt all value of request details and response details 
		 */
		api : 'N'
}

//load the controllers, the main controller must be the last one
CB.LoadControllers= ['simpleView','home','setting'];


//launch the app
CB.Launch('home',false,'none');
CB.openWindow();
