<template>
  <common-page
    :color="_meta.color"
    :texts="data.texts"
    :inputs="data.inputs"
    :links="data.links"
    :validations="data.validations"
    :errorMessages="data.errorMessages"
    @submit="handleSubmit"
  />
</template>

<script>
import CommonPageComponent from "../components/CommonPage";

export default {
  components: {
    "common-page": CommonPageComponent,
  },

  props: {
    _meta: Object,
    data: Object,
  },

  created() {
    const key = { key: this.$route.query.key };
    if (this._meta.checkKey && key) console.warn("Chave não encontrada");
    else {
      this.$http
        .post(`${this._meta.apiURL}${this.data.apiPath}`, key)
        .then((response) => console.warn(response))
        .catch((error) => console.warn(error));
    }
  },

  methods: {
    handleSubmit(user) {
      this.$http
        .post(`${this._meta.apiURL}${this.data.apiPath}`, user)
        .then((response) => console.warn(response))
        .catch((error) => console.warn(error));
    },
  },
};
</script>