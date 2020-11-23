import Router from 'vue-router';


// entry component
import djTool from '../components/djTool';

export default new Router({
  routes: [
    {
      path: '/',
      name: 'djtool',
      component: djTool,
    },
  ],
});
