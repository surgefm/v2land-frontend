<template>
  <div class="action-set-container">
    <div class="center">
      <action-item
        v-for="tab of displayList.tab"
        :action="`event-action-${tab}`"
        :key="tab"
        :class="[displayList.tab.length > 2 || 'two-tabs']"
      />
      <action-item
        v-for="tab of displayList.dropdown"
        :action="`event-action-${tab}`"
        class="small"
        :key="tab"
      />
      <el-dropdown trigger="click" placement="top-end" :show-timeout="0">
        <a>
          <i
            v-if="displayList.dropdown.length > 0"
            class="subscribe-container dropdown-trigger light-font el-icon-more"
          />
        </a>
        <el-dropdown-menu slot="dropdown" class="action-dropdown large">
          <el-dropdown-item v-for="item of displayList.dropdown" :key="item">
            <action-item :action="`event-action-${item}`" type="dropdown" />
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import EventActionItem from './EventActionItem.vue';

  export default {
    components: {
      'action-item': EventActionItem,
    },
    computed: {
      displayList() {
        const tab = [];
        const dropdown = [];
        for (const i of [
          'admin-event', 'admin-admit', 'create-event', 'subscribe', 'post',
          'admit', 'edit', 'edit-image', 'subscription-list', 'client-setting',
          'client', 'return', 'homepage',
        ]) {
          let action = i.split('-');
          for (let j = 0; j < action.length; j++) {
            action[j] = action[j][0].toUpperCase() + action[j].slice(1);
          }
          action = action.join('');
          if (this[`show${action}`]) {
            if (tab.length < 3) {
              tab.push(i);
            } else {
              dropdown.push(i);
            }
          }
        }

        return { tab, dropdown };
      },
      isClientAdmin() {
        return this.$store.getters.isClientAdmin;
      },
      isHomepage() {
        return this.$route.path === '/';
      },
      isLoggingIn() {
        return this.$route.path.includes('login') || this.$route.path.includes('register');
      },
      isAdminDir() {
        return this.$route.path.includes('/admin');
      },
      isSubscriptionPage() {
        return this.$route.path === '/subscription';
      },
      isClientPage() {
        return this.$route.path === '/me';
      },
      isLoggedIn() {
        return this.$store.getters.isLoggedIn;
      },
      isCreatingEvent() {
        return this.$route.name === 'new';
      },
      showAdminEvent() {
        return ((this.isHomepage || this.isSubscriptionPage || this.isClientPage) &&
          this.isClientAdmin) || this.isAdminDir;
      },
      showAdminAdmit() {
        return this.showAdminEvent;
      },
      showCreateEvent() {
        return this.isHomepage || this.isAdminDir;
      },
      showSubscribe() {
        return this.$route.name.includes('name');
      },
      showPost() {
        return this.showSubscribe && !this.isLoggingIn;
      },
      showAdmit() {
        return this.$route.name.includes('name');
      },
      showEdit() {
        return this.showAdmit;
      },
      showEditImage() {
        return this.showAdmit;
      },
      showSubscriptionList() {
        return this.isLoggedIn && (this.isHomepage || this.isClientPage);
      },
      showClientSetting() {
        return this.isLoggedIn && !this.isLoggingIn;
      },
      showClient() {
        return !this.isLoggingIn;
      },
      showReturn() {
        return this.$route.name !== 'name' &&
          this.$route.name.includes('name');
      },
      showHomepage() {
        return !this.showReturn && !this.isHomepage;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .action-set-container {
    display: flex;
    justify-content: center;
    position: fixed;
    top: 7rem;
    left: 0;
    width: 100%;
    z-index: 1100;
    visibility: hidden;
  }

  .center {
    width: 100%;
    max-width: 53rem;
    padding-right: .5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    visibility: hidden;
  }

  .action {
    margin-top: .5rem;
    position: relative;
    visibility: visible;
  }

  .action:first-child {
    margin-top: 0;
  }

  @media (max-width: 780px) {
    .center {
      max-width: 50rem;
    }
  }

  @media (min-width: 600px) {
    .large {
      display: none;
    }
  }

  @media (max-width: 600px) {
    .action-set-container {
      top: initial;
      bottom: 0;
      right: 0;
      width: 100%;
    }

    .center {
      flex-direction: row;
      max-width: auto;
      visibility: visible;
      background-color: rgba(256, 256, 256, .95);
      justify-content: space-between;
      padding-right: 0;
    }

    .action {
      flex-grow: 1;
      padding: .25rem .25rem;
      margin: 0;
      justify-content: center;
      height: 2.5rem;
    }

    .small {
      display: none;
    }

    .dropdown-trigger {
      width: 3.5rem;
      height: 2.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer !important;
      user-select: none;
    }
  }
</style>
