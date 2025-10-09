<template>
  <b-nav-item
    :is="baseComponent"
    :to="link.path ? link.path : '/'"
    class="nav-item"
    :class="{ active: isActive }"
  >
    <a
      v-if="isMenu"
      class="sidebar-menu-item nav-link"
      :class="{ active: isActive }"
      :aria-expanded="!collapsed"
      data-toggle="collapse"
      @click.prevent="collapseMenu"
    >
      <template v-if="addLink">
        <span class="nav-link-text">
          {{ link.name }} <b class="caret"></b>
        </span>
      </template>
      <template v-else>
        <i :class="link.icon"></i>
        <span class="nav-link-text">{{ link.name }} <b class="caret"></b></span>
      </template>
    </a>

    <collapse-transition>
      <div
        v-if="$slots.default || this.isMenu"
        v-show="!collapsed"
        class="collapse show"
      >
        <ul class="nav nav-sm flex-column">
          <slot></slot>
        </ul>
      </div>
    </collapse-transition>

    <slot
      name="title"
      v-if="children.length === 0 && !$slots.default && link.path"
    >
      <component
        :to="link.path"
        @click.native="linkClick"
        :is="elementType(link, false)"
        class="nav-link"
        :class="{ active: link.active }"
        :target="link.target"
        :href="link.path"
      >
        <template v-if="addLink">
          <span class="nav-link-text">{{ link.name }}</span>
        </template>
        <template v-else>
          <i :class="link.icon"></i>
          <span class="nav-link-text">{{ link.name }}</span>
        </template>
      </component>
    </slot>
  </b-nav-item>
</template>
<script>
import { CollapseTransition } from 'vue2-transitions';

export default {
  name: 'sidebar-item',
  components: {
    CollapseTransition
  },
  props: {
    menu: {
      type: Boolean,
      default: false,
      description:
        "Whether the item is a menu. Most of the item it's not used and should be used only if you want to override the default behavior."
    },
    link: {
      type: Object,
      default: () => {
        return {
          name: '',
          path: '',
          children: []
        };
      },
      description:
        'Sidebar link. Can contain name, path, icon and other attributes. See examples for more info'
    }
  },
  provide() {
    return {
      addLink: this.addChild,
      removeLink: this.removeChild
    };
  },
  inject: {
    addLink: { default: null },
    removeLink: { default: null },
    autoClose: {
      default: true
    }
  },
  data() {
    return {
      children: [],
      collapsed: true
    };
  },
  computed: {
    baseComponent() {
      return this.isMenu || this.link.isRoute ? 'li' : 'router-link';
    },
    linkPrefix() {
      if (this.link.name) {
        let words = this.link.name.split(' ');
        return words.map(word => word.substring(0, 1)).join('');
      }
    },
    isMenu() {
      return this.children.length > 0 || this.menu === true;
    },
    isActive() {
      if (this.$route && this.$route.path) {
        let matchingRoute = this.children.find(c =>
          this.$route.path.startsWith(c.link.path)
        );
        if (matchingRoute !== undefined) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    addChild(item) {
      const index = this.$slots.default.indexOf(item.$vnode);
      this.children.splice(index, 0, item);
    },
    removeChild(item) {
      const tabs = this.children;
      const index = tabs.indexOf(item);
      tabs.splice(index, 1);
    },
    elementType(link, isParent = true) {
      if (link.isRoute === false) {
        return isParent ? 'li' : 'a';
      } else {
        return 'router-link';
      }
    },
    linkAbbreviation(name) {
      const matches = name.match(/\b(\w)/g);
      return matches.join('');
    },
    linkClick() {
      if (
        this.autoClose &&
        this.$sidebar &&
        this.$sidebar.showSidebar === true
      ) {
        this.$sidebar.displaySidebar(false);
      }
    },
    collapseMenu() {
      this.collapsed = !this.collapsed;
    },
    collapseSubMenu(link) {
      link.collapsed = !link.collapsed;
    }
  },
  mounted() {
    if (this.addLink) {
      this.addLink(this);
    }
    if (this.link.collapsed !== undefined) {
      this.collapsed = this.link.collapsed;
    }
    if (this.isActive && this.isMenu) {
      this.collapsed = false;
    }
  },
  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    if (this.removeLink) {
      this.removeLink(this);
    }
  }
};
</script>
<style lang="scss">
.sidebar-menu-item {
  cursor: pointer;
}

/* Enhanced Sidebar Item Animations */
.nav-item {
  position: relative;
  
  .nav-link {
    position: relative;
    overflow: hidden;
    
    /* Icon animation */
    i {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        transform: scale(1.1) rotate(5deg);
      }
    }
    
    /* Text animation */
    .nav-link-text {
      transition: all 0.3s ease;
      position: relative;
      z-index: 2;
    }
    
    /* Ripple effect */
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.6s ease, height 0.6s ease;
      z-index: 1;
    }
    
    &:active::after {
      width: 300px;
      height: 300px;
    }
    
    /* Glow effect for active items */
    &.active {
      &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, #ff6b6b, #ee5a24, #ff6b6b);
        border-radius: 14px;
        z-index: -1;
        animation: glow 2s ease-in-out infinite alternate;
      }
    }
  }
}

/* Glow animation */
@keyframes glow {
  from {
    box-shadow: 0 0 20px rgba(255,107,107,0.4);
  }
  to {
    box-shadow: 0 0 30px rgba(255,107,107,0.8), 0 0 40px rgba(255,107,107,0.4);
  }
}

/* Pulse animation for icons */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Add pulse to active icons */
.nav-item .nav-link.active i {
  animation: pulse 2s ease-in-out infinite;
}

/* Special hover effects for different menu items */
.nav-item:nth-child(1) .nav-link:hover { /* Dashboard */
  background: linear-gradient(135deg, rgba(116,185,255,0.3) 0%, rgba(116,185,255,0.1) 100%);
}

.nav-item:nth-child(2) .nav-link:hover { /* Tags */
  background: linear-gradient(135deg, rgba(253,121,168,0.3) 0%, rgba(253,121,168,0.1) 100%);
}

.nav-item:nth-child(3) .nav-link:hover { /* Email */
  background: linear-gradient(135deg, rgba(253,203,110,0.3) 0%, rgba(253,203,110,0.1) 100%);
}

.nav-item:nth-child(4) .nav-link:hover { /* KOL */
  background: linear-gradient(135deg, rgba(108,92,231,0.3) 0%, rgba(108,92,231,0.1) 100%);
}

.nav-item:nth-child(5) .nav-link:hover { /* Products */
  background: linear-gradient(135deg, rgba(162,155,254,0.3) 0%, rgba(162,155,254,0.1) 100%);
}

.nav-item:nth-child(6) .nav-link:hover { /* Login */
  background: linear-gradient(135deg, rgba(253,121,168,0.3) 0%, rgba(253,121,168,0.1) 100%);
}

.nav-item:nth-child(7) .nav-link:hover { /* Register */
  background: linear-gradient(135deg, rgba(253,203,110,0.3) 0%, rgba(253,203,110,0.1) 100%);
}
</style>
