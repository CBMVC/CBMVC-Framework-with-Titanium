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
 * The data models, include all data operation
 */
CB.Models = (function() {
  var m = {};

  m.human = new CB.DB.model({
    table:    'human',
    columns:  {
      id:                 'INTEGER PRIMARY KEY AUTOINCREMENT',
      city_id:            'INTEGER',
      first_name:         'TEXT',
      last_name:          'TEXT'
    },
		methods : {
			getByFirstName : function(firstName) {
				// get by firstName
				var result = CB.DB.models.get('human').findOneBy('first_name', firstName);

				if (!result) {
					throw 'Could not find a firstName  with the  ' + firstName + '!';
				} else {
					return result;
				}
			}
		}
  });

  m.city = new CB.DB.model({
    table:    'city',
    columns:  {
      id:                 'INTEGER PRIMARY KEY AUTOINCREMENT',
      country_id:         'INTEGER',
      name:               'TEXT',
      description:        'TEXT'
    }
  });

  m.country = new CB.DB.model({
    table:    'country',
    columns:  {
      id:                 'INTEGER PRIMARY KEY AUTOINCREMENT',
      name:               'TEXT'
    }
  });

  return m;
})();
