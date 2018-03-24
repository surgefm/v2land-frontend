import Vue from 'vue';
import PageFoot from '~/components/PageFoot.vue';
import Logo from '~/components/Logo.vue';
import Background from '~/components/Background.vue';
import Card from '~/components/Card.vue';
import EventNewsContent from '~/components/EventNews/EventNewsContent.vue';
import EventAction from '~/components/EventAction/EventAction.vue';
import EventTitle from '~/components/EventTitle';
import LogoType from '~/components/LogoType.vue';

Vue.component('page-foot', PageFoot);
Vue.component('logo', Logo);
Vue.component('background', Background);
Vue.component('card', Card);
Vue.component('event-news-content', EventNewsContent);
Vue.component('event-action', EventAction);
Vue.component('event-title', EventTitle);
Vue.component('logotype', LogoType);
