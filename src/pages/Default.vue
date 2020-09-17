<template>
  <common-page
    :color="_meta.color"
    :texts="data.texts"
    :inputs="data.inputs"
    :links="data.links"
    :response="data.response"
    :validations="data.validations"
    :error-messages="data.errorMessages"
    :form-state="formState"
    @submit="handleSubmit"
  />
</template>

<script>
import CommonPageComponent from "../components/CommonPage.vue";

export default {
  components: {
    "common-page": CommonPageComponent,
  },

  props: {
    _meta: Object,
    initialData: Object,
    successHandle: Object,
  },

  data: function() {
    var data = this.initialData;
    data.response = {};
    return {
      data: data,
      formState: "visible",
    };
  },

  beforeMount() {
    if (this.data.checkParameters) {
      this.formState = "loading";
      const key = this.$route.query.key;
      const email = this.$route.query.email;
      if (!key) {
        this.data.response = {
          type: "error",
          message: "Chave não encontrada no link.",
        };
      } else if (!email) {
        this.data.response = {
          type: "error",
          message: "Usuário não encontrado no link.",
        };
      } else {
        this.$http
          .post(`${this._meta.apiURL}${this.data.validationPath}`, {
            key: key,
            email: email,
          })
          .then(() => (this.formState = "visible"))
          .catch((error) => {
            this.data.response = {
              type: "error",
              message: error.response.data.message,
            };
            this.formState = "hidden";
          });
      }
    }
  },

  methods: {
    handleSubmit(data) {
      data = this.addParameters(data);
      this.$http
        .post(`${this._meta.apiURL}${this.data.apiPath}`, data)
        .then((response) => {
          if (this.successHandle) {
            if (this.successHandle.type === "redirect") {
              this.$router.push(this.successHandle.url);
            } else if (this.successHandle.type === "message") {
              console.warn(response);
              this.data.response = {
                type: response.data.type,
                message: response.data.message,
              };
            }
          }
        })
        .catch((error) => {
          this.data.response = {};
          this.data.response = {
            type: "error",
            message: error.response.data.message,
          };
          console.warn(this.data.response);
        });
    },
    addParameters(data) {
      const queryParameters = this.$route.query;
      return { ...data, ...queryParameters };
    },
  },
};
</script>