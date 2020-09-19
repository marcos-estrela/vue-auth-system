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
        this.formState = "visible";
      } else if (!email) {
        this.data.response = {
          type: "error",
          message: "Usuário não encontrado no link.",
        };
        this.formState = "visible";
      } else {
        const origin = window.location.origin;
        this.$http
          .post(`${origin}/${this._meta.apiURL}${this.data.validationPath}`, {
            key: key,
            email: email,
          })
          .then((response) => {
            this.formState = "visible";
            const type = Object.keys(response.data)[0];
            if (type) {
              this.data.response = {
                type: type,
                message: response.data[type].message,
              };
            }
          })
          .catch((error) => {
            const type = Object.keys(error.response.data)[0];
            this.data.response = {
              type: type,
              message: error.response.data[type].message,
            };
            this.formState = "hidden";
          });
      }
    }
  },

  methods: {
    handleSubmit(data) {
      data = this.addParameters(data);
      const origin = window.location.origin;
      this.$http
        .post(`${origin}/${this._meta.apiURL}${this.data.apiPath}`, data)
        .then((response) => {
          if (this.successHandle) {
            if (this.successHandle.type === "redirect") {
              this.$router.push(this.successHandle.url);
            } else if (this.successHandle.type === "message") {
              const type = Object.keys(response.data)[0];
              this.data.response = {
                type: type,
                message: response.data[type].message,
              };
            }
          }
        })
        .catch((error) => {
          var type;
          var message;
          if (error.response) {
            type = Object.keys(error.response.data)[0];
            message = error.response.data[type].message;
          } else {
            type = "error";
            message = "Ocorreu um erro no tratamento do retorno da chamada";
          }
          this.data.response = {
            type: type,
            message: message,
          };
        });
    },
    addParameters(data) {
      const queryParameters = this.$route.query;
      return { ...data, ...queryParameters };
    },
  },
};
</script>
