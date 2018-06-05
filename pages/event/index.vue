<template>
  <div>
    <background>
      <event-abstract-loader v-if="showLoader" />
      <event-news-loader
        v-if="showLoader"
        v-for="(index) of new Array(3)"
        :key="index"
      />
      <event-abstract v-if="!showLoader" :detail="event" />
      <div 
        v-if="!showLoader"
        v-for="(stack, i) of stackCollection"
        :key="stack.id"
        :id="'i' + stack.id"
        class="stack"
      >
        <event-stack
          class="stack" 
          :stack="stack"
          :order="stackCollection.length - i"
          :id="'main-i' + stack.id"
          :event="event"
        />
      </div>
      <page-foot />
    </background>
  </div>
</template>

<script>
  import config from '~/const';
  import EventAbstract from '~/components/EventAbstract/EventAbstract.vue';
  import EventAbstractLoader from '~/components/EventAbstract/EventAbstractLoader.vue';
  import EventStack from '~/components/EventStack/EventStack.vue';

  export default {
    computed: {
      showLoader() {
        const { status } = this.fetchingStatus;
        return status !== 'loaded' &&
          status !== 'serverLoaded';
      },
      name() {
        return this.$route.params.name;
      },
      fetchingStatus() {
        return this.$store.getters.getFetchingStatus('getEvent');
      },
      event() {
        return this.$store.getters.getEvent(this.name);
      },
      stackCollection() {
        // return this.$store.getters.getStackCollectionByEvent({
        //   event: this.name,
        // });
        return [
          {
            title: '最后',
            description: '李白骑鲸鱼',
            order: 3,
            event: 12,
            news: [
              {
                title: '123',
                abstract: '321',
                url: 'https://google.com',
                source: '咕果',
              },
              {
                title: '123',
                abstract: '321',
                url: 'https://google.com',
                source: '咕果',
              },
              {
                title: '123',
                abstract: '321',
                url: 'https://google.com',
                source: '咕果',
              },
            ],
          },
          {
            title: '其次',
            description: '李白骑鲸鱼',
            order: 2,
            event: 12,
            news: [
              {
                title: '123',
                abstract: '321',
                url: 'https://google.com',
                source: '咕果',
              },
              {
                title: '123',
                abstract: '321',
                url: 'https://google.com',
                source: '咕果',
              },
              {
                title: '123',
                abstract: '321',
                url: 'https://google.com',
                source: '咕果',
              },
            ],
          },
          {
            title: '首先',
            description: '李白骑鲸鱼',
            order: 1,
            event: 12,
            news: [
              {
                title: '123',
                abstract: '321',
                url: 'https://google.com',
                source: '咕果',
              },
              {
                title: '123',
                abstract: '321',
                url: 'https://google.com',
                source: '咕果',
              },
              {
                title: '123',
                abstract: '321',
                url: 'https://google.com',
                source: '咕果',
              },
            ],
          },
        ];
      },
      image() {
        return config.static + this.event.headerImage.imageUrl;
      },
    },
    methods: {
      scrollToNews() {
        if (+this.$route.params.stack && document) {
          setTimeout(() => {
            const element = document.getElementById('i' + this.$route.params.stack);
            const stack = document.getElementById('main-i' + this.$route.params.stack);
            if (element) {
              element.scrollIntoView();
              window.scrollBy(0, -50);
              stack.className += ' emphasize';
            }

            this.$router.replace({
              ...this.$route,
              name: 'event-pinyin',
            });
          }, 50);
        }
      },
      async init() {
        const status = this.fetchingStatus.status;
        if (status == 'serverLoaded') {
          this.$store.commit('setFetchingStatus', {
            name: 'getEvent',
            status: 'loaded',
          });
        } else {
          const { name } = this.$route.params;
          await this.$store.dispatch('fetchEvent', {
            name,
            isEventPage: true,
          });
        }
        if (!this.$store.getters.isServer) {
          this.scrollToNews();
        }
      },
    },
    async asyncData({ store, params, redirect, route }) {
      if (store.getters.isServer) {
        const event = await store.dispatch('fetchEvent', {
          name: params.name,
          isEventPage: true,
        });
        store.commit('setFetchingStatus', {
          name: 'getEvent',
          status: 'serverLoaded',
        });
        if (!event) {
          redirect({
            name: 'not-found',
            query: { status: 'event_not_found' },
          });
        }
      }
    },
    mounted() {
      this.init();
    },
    watch: {
      '$route.params.stack'() {
        this.scrollToNews();
      },
    },
    head() {
      let title = this.event.name + ' - 浪潮，你的社会事件追踪工具';
      const image = this.event
        ? (this.event.headerImage ? this.image : null)
        : null;
      let description = this.event
        ? this.event.description
        : null;

      if (this.$route.params.stack) {
        const stack = this.$store.getters.getStack(this.$route.params.stack);
        if (stack) {
          title = `${stack.title} - ${this.event.name}`;
          description = stack.description || description;
        }
      }
      return {
        title,
        meta: [
          description ? { hid: 'description', name: 'description', content: description } : {},
          { hid: 't:title', name: 'twitter:title', content: title },
          { hid: 'og:title', property: 'og:title', content: title },
          description ? { hid: 't:description', name: 'twitter:description', content: description } : {},
          description ? { hid: 'og:description', property: 'og:description', content: description } : {},
          image ? { hid: 't:image', name: 'twitter:image', content: image } : {},
          image ? { hid: 'og:image', property: 'og:image', content: image } : {},
        ],
      };
    },
    components: {
      'event-abstract': EventAbstract,
      'event-abstract-loader': EventAbstractLoader,
      'event-stack': EventStack,
    },
  };
</script>

<style lang="scss" scoped>
  .stack {
    width: 100%;
    max-width: 35rem;
  }
</style>
