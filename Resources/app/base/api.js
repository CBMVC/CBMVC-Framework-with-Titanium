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
 * set the remote API
 */
CB.API = {
	server : 'http://www.coderblog.in/',
	//default ajax call timeout
	timeout: 1000,
	//common error handle
	errorHandle : function(status){
		switch (status) {
			case '1':
				CB.Util.alert(AvantBiz.Util.L('invalidSession'), AvantBiz.Util.L('error'));
				AvantBiz.Launch(AvantBiz.RootController, false, 'right');
				break;
			case '2':
				AvantBiz.Util.alert(AvantBiz.Util.L('timeout'), AvantBiz.Util.L('error'));
				AvantBiz.Launch(AvantBiz.RootController, false, 'right');
				break;
			/*case '3':
				AvantBiz.Util.alert(AvantBiz.Util.L('invalidInput'), AvantBiz.Util.L('error'));
				break;*/							
		} 
	},
	
	loginErrorHandle : function(status){
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
	}
};

(function(){
	
	CB.Platform.extend(CB.API, {
		//set each api function's url
		login : {
			name: 'login',
			value: CB.API.server + 'api/login.aspx',
			saveData : false,
			errorHandel : CB.API.loginErrorHandle
		}
	});
	
})();
