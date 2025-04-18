<script>
/**
 * Horizontal-topbar component
 */

import { useCartStore } from "@/state/pinia";
import { mapState } from "pinia";

export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState(useCartStore, ["cartItems"]),
    userRole() {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user).user_role_name || "" : "";
    },
    user() {
      return JSON.parse(localStorage.getItem("user")) || {};
    },
    userName() {
      return this.user.name || "Guest"; // nama default
    },
    userAvatar() {
      return this.user.photo_url || null;
    },
    defaultAvatar() {
      return require("@/assets/images/users/avatar-1.jpg");
    }
  },
  components: {},
  data() {
    return {};
  },
  mounted() { },
  methods: {
    toggleMenu() {
      this.$parent.toggleMenu();
    },

    // Navigate to Cart Page
    goToCart() {
      this.$router.push({ name: "cart" });
    },

    goToMyOrder() {
      this.$router.push({ name: "my-orders" });
    },


    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */ !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },

  },
  watch: {
    type: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "dark":
              document.body.setAttribute("data-topbar", "dark");
              document.body.removeAttribute("data-layout-scrollable");
              break;
            case "light":
              document.body.setAttribute("data-topbar", "light");
              document.body.removeAttribute("data-layout-size", "boxed");
              document.body.removeAttribute("data-layout-scrollable");
              break;
            case "colored":
              document.body.setAttribute("data-topbar", "colored");
              document.body.removeAttribute("data-layout-size", "boxed");
              break;
            default:
              document.body.setAttribute("data-topbar", "dark");
              break;
          }
        }
      },
    },
    width: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "boxed":
              document.body.setAttribute("data-layout-size", "boxed");
              document.body.removeAttribute("data-layout-scrollable");
              break;
            case "fluid":
              document.body.setAttribute("data-layout-mode", "fluid");
              document.body.removeAttribute("data-layout-scrollable");
              document.body.removeAttribute("data-layout-size");
              break;
            case "scrollable":
              document.body.setAttribute("data-layout-scrollable", "true");
              document.body.removeAttribute("data-layout-mode");
              document.body.removeAttribute("data-layout-size");
              break;
            default:
              document.body.setAttribute("data-layout-mode", "fluid");
              break;
          }
        }
      },
    },
    mode: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "light":
              document.body.setAttribute("data-bs-theme", "light");
              break;
            case "dark":
              document.body.setAttribute("data-bs-theme", "dark");
              break;
            default:
              document.body.setAttribute("data-bs-theme", "light");
              break;
          }
        }
      },
    },
  },
  onMounted() {
    const cartStore = useCartStore();
    cartStore.fetchCartItems();
  },
};

</script>

<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="d-flex">
        <!-- LOGO -->
        <div class="navbar-brand-box">
          <router-link to="/" class="logo logo-dark">
            <span class="logo-sm">
              <img src="@/assets/images/logo.svg" alt height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/logo-dark.png" alt height="17" />
            </span>
          </router-link>

          <router-link to="/" class="logo logo-light">
            <span class="logo-sm">
              <img src="@/assets/images/logo-light.svg" alt height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/logo-light.png" alt height="19" />
            </span>
          </router-link>
        </div>

        <BButton variant="white" id="toggle" type="button" class="btn btn-sm me-2 font-size-16 d-lg-none header-item"
          @click="toggleMenu">
          <i class="fa fa-fw fa-bars"></i>
        </BButton>
      </div>

      <div class="d-flex">
        <BDropdown class="d-inline-block d-lg-none ms-2" variant="black"
          menu-class="dropdown-menu-lg p-0 dropdown-menu-end" toggle-class="header-item noti-icon" right>
          <template v-slot:button-content>
            <i class="mdi mdi-magnify"></i>
          </template>

          <BForm class="p-3">
            <div class="form-group m-0">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="Search ..." aria-label="Recipient's username" />
                <div class="input-group-append">
                  <BButton class="btn btn-primary" type="submit">
                    <i class="mdi mdi-magnify"></i>
                  </BButton>
                </div>
              </div>
            </div>
          </BForm>
        </BDropdown>

        <!-- FULLSCREEN TOGGLE -->
        <div class="dropdown d-none d-lg-inline-block ms-1" v-if="userRole !== 'Client'">
          <BButton variant="white" type="button" class="btn header-item noti-icon" @click="initFullScreen">
            <i class="bx bx-fullscreen"></i>
          </BButton>
        </div>

        <!-- ORDER: Navigate to My Orders -->
        <div class="dropdown d-none d-lg-inline-block ms-1" v-if="userRole !== 'Super Admin'">
          <BButton variant="white" type="button" class="btn header-item noti-icon" @click="goToMyOrder">
            <i class="bx bx-receipt"></i>
          </BButton>
        </div>

        <!-- CART: Navigate to Cart Page -->
        <div class="dropdown d-none d-lg-inline-block ms-1 position-relative" v-if="userRole !== 'Super Admin'">
          <BButton variant="white" type="button" class="btn header-item noti-icon" @click="goToCart">
            <i class="bx bx-cart"></i>
            <span v-if="cartItems.length > 0" class="cart-badge">
              {{ cartItems.length }}
            </span>
          </BButton>
        </div>

        <BDropdown right variant="black" toggle-class="header-item">
          <template v-slot:button-content>
            <img class="rounded-circle header-profile-user" :src="userAvatar || defaultAvatar" alt="Header Avatar" />
            <span class="d-none d-xl-inline-block ms-1">{{ userName }}</span>
            <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
          </template>

          <BDropdownItem>
            <router-link to="#" v-slot="{ navigate }" custom>
              <span @click="navigate" @keypress.enter="navigate">
                <i class="bx bx-user font-size-16 align-middle me-1"></i>
                Profile
              </span>
            </router-link>
          </BDropdownItem>

          <BDropdownDivider></BDropdownDivider>

          <router-link to="/logout" class="dropdown-item text-danger">
            <i class="bx bx-power-off font-size-16 align-middle me-1 text-danger"></i>
            Logout
          </router-link>
        </BDropdown>

      </div>
    </div>
  </header>
</template>

<style scoped>
.cart-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background: red;
  color: white;
  font-size: 12px;
  font-weight: bold;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
