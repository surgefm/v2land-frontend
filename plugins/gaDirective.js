import Vue from 'vue';

export default ({ app }) => {
  Vue.directive('analytics', {
    inserted(el, binding) {
      if (binding.value.type !== 'social') {
        el.addEventListener('click', (event) => {
          const { action, label, value } = binding.value;
          app.$ga.event({
            eventCategory: 'ClientBehavior',
            eventAction: action,
            eventLabel: label,
            eventValue: value,
          });
        });
      } else {
        el.addEventListener('click', (event) => {
          const { action, network, target } = binding.value;
          app.$ga.social({
            socialNetwork: network,
            socialAction: action,
            socialTarget: target,
          });
        });
      }
    },
  });
};
