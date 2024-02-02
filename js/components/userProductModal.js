const {
  ref, onMounted, watch
} = Vue;

export default {  
  template: "#userProductModal",
  props: ["id"],
  setup(props, { emit }) {
    const modalRef = ref(null);
    const modal = ref(null);
    const product = ref({});
    const qty = ref(1);

    const openModal = () => {
      modal.value.show();
    };
    const closeModal = () => {
      modal.value.hide();
    };
    const getProduct = () => {
      const apiUrl = "https://vue3-course-api.hexschool.io/v2";
      const apiPath = "charlotte-lee849";
      axios
        .get(`${apiUrl}/api/${apiPath}/product/${props.id}`)
        .then((res) => {
          product.value = res.data.product;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };
    const addToCart = () => {
      emit('add-cart', product.value.id, qty.value);
    };

    watch(() => {
      return props.id;
    }, () => {
      getProduct();
    });

    onMounted(() => {
      modal.value = new bootstrap.Modal(modalRef.value, {
        keyboard: false,
        backdrop: 'static',
      });
    });

    return {
      modalRef,
      qty,      
      product,
      openModal,
      closeModal,
      addToCart
    }
  },    
};
