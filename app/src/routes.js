import Vue from 'vue'

export default {
  '/': {
  	component: function(resolve){
  		require(['./components/FirstScreenPageView'], resolve)
  	},
  	name: 'index'
  },
  '/instructions': {
		component: function(resolve){
  		require(['./components/InstructionsPageView'], resolve)
  	},
  	name: 'instructions'
  }
}
