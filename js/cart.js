import userProductModal from "./components/userProductModal.js";

const { createApp, ref, onMounted } = Vue;

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);

configure({
  generateMessage: localize("zh_TW"),
});

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "charlotte-lee849";

createApp({
  setup() {
    const formRef = ref(null);
    const userProductModalRef = ref(null);
    const cartData = ref({ carts: [] });
    const form = ref({
      user: {
        name: '',
        email: '',
        tel: '',
        address: '',
      },
      message: '',
    });
    const products = ref([]);
    const productId = ref([""]);
    const isLoadingItem = ref("");
    const getProducts = () => {
      axios
      .get(`${apiUrl}/api/${apiPath}/products/all`)
      .then((res) => {
        products.value = res.data.products;
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
    };
    const getCarts = () => {
      axios
      .get(`${apiUrl}/api/${apiPath}/cart`)
      .then((res) => {
        cartData.value = res.data.data;
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
    };
    const addToCart = (id, qty = 1) => {
      const data = {
        product_id: id,
        qty,
      };
      isLoadingItem.value = id;
      axios
        .post(`${apiUrl}/api/${apiPath}/cart`, { data })
        .then((res) => {
          getCarts();
          userProductModalRef.value.closeModal();
          isLoadingItem.value = "";
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };
    const removeCartItem = (id) => {
      isLoadingItem.value = id;
      axios
        .delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
        .then((res) => {
          getCarts();
          isLoadingItem.value = "";
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };
    const deleteAllCarts = () => {
      axios
      .delete(`${apiUrl}/api/${apiPath}/carts`)
      .then((res) => {
        getCarts();
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
    };
    const updateCartItem = (item) => {
      const data = {
        product_id: item.product_id, // 要用 product_id, 不能用id, 新增相同產品到購物車時需累加項目
        qty: item.qty,
      };
      isLoadingItem.value = item.id;
      axios
        .put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data })
        .then((res) => {
          getCarts();
          isLoadingItem.value = "";
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };
    const createOrder = () => {
      const order = form.value;
      axios
        .post(`${apiUrl}/api/${apiPath}/order`, { data: order })
        .then((res) => {
          formRef.value.resetForm();
          getCarts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };
    const openProductModal = (id) => {
      productId.value = id;
      userProductModalRef.value.openModal();
    }

    onMounted(() => {
      getProducts();
      getCarts();
    });

    return {
      cartData,
      form,
      products,
      productId,
      isLoadingItem,
      formRef,
      userProductModalRef,
      getCarts,
      addToCart,
      removeCartItem,
      deleteAllCarts,
      updateCartItem,
      createOrder,
      openProductModal,
    }
  }, 
})
  .component("v-form", Form)
  .component("v-field", Field)
  .component("error-message", ErrorMessage)
  .component("userProductModal", userProductModal)
  .mount("#app");
