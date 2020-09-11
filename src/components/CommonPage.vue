<template>
  <div class="page" :style="pageBackgroundColor">
    <div class="main">
      <span v-if="texts.title" class="title" :style="textColor" align="center">{{texts.title}}</span>
      <span v-if="texts.description" class="description">{{texts.description}}</span>
      <form @submit.prevent="submit" novalidate>
        <div class="form-input" v-for="input in inputs" :key="input.id">
          <input
            v-model.trim="$v.formData[input.id].$model"
            :style="$v.formData[input.id].$dirty && $v.formData[input.id].$invalid ? 'border-color: red': ''"
            :type="input.type ? input.type : 'text'"
            :placeholder="input.placeholder"
          />
          <div
            class="error-message"
            v-if="$v.formData[input.id].$dirty && $v.formData[input.id].$invalid"
          >{{errorMessage(input.id)}}</div>
        </div>
        <button v-if="texts.button" type="submit" :style="buttonBackgroundColor">{{texts.button}}</button>
        <a
          v-for="link in links"
          :key="link.id"
          class="link"
          align="center"
          :href="link.url"
          :style="textColor"
        >{{link.text}}</a>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "common-page",

  props: {
    color: String,
    texts: {
      type: Object,
      default: () => {},
    },
    inputs: {
      type: Array,
      default: () => [],
    },
    links: {
      type: Array,
      default: () => [],
    },
    validations: {
      type: Object,
      default: () => {},
    },
    errorMessages: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    // Initilize formData
    const formData = {};
    this.inputs.forEach((el) => {
      formData[el.id] = "";
      this.input;
    });
    return { formData: formData };
  },

  validations() {
    var internalValidations = this.validations;
    if (!internalValidations) {
      internalValidations = {};
      this.inputs.forEach((el) => {
        internalValidations[el.id] = {};
      });
    }
    return { formData: internalValidations };
  },

  computed: {
    pageBackgroundColor: function () {
      return { "background-color": `rgba(${this.normalizedColor}, 0.5)` };
    },
    textColor: function () {
      return { color: `rgb(${this.normalizedColor})` };
    },
    buttonBackgroundColor: function () {
      return { "background-color": `rgba(${this.normalizedColor}, 0.7)` };
    },
    normalizedColor: function () {
      return this.hexToRgb(this.color);
    },
  },

  methods: {
    hexToRgb(hex) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
      });
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return result ? `${r},${g},${b}` : null;
    },
    errorMessage(field) {
      const fieldValidations = Object.keys(this.validations[field]);
      for (let validationRule of fieldValidations) {
        const validation = this.$v.formData[field][validationRule];
        if (validation === false) {
          return this.errorMessages[field][validationRule];
        }
      }
      return "";
    },
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
      } else {
        this.$emit("submit", this.formData);
      }
    },
  },
};
</script>

<style scoped>
.page {
  display: flex;
  height: 100%;
  font-family: sans-serif;
  z-index: -10;
  text-align: center;
}

.main {
  background-color: #ffffff;
  width: 300px;
  margin: auto;
  height: fit-content;
  border-radius: 1.5em;
  box-shadow: 0px 11px 35px 2px rgba(0, 0, 0, 0.14);
  padding: 50px 50px;
  display: grid;
}

.title {
  padding-bottom: 30px;
  font-weight: bold;
  font-size: 23px;
}

form {
  width: 100%;
  display: grid;
  justify-items: center;
}

input {
  width: 80%;
  color: rgb(38, 50, 56);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  background: rgba(0, 0, 0, 0.13);
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  outline: none;
  box-sizing: border-box;
  border: 2px solid rgba(0, 0, 0, 0.02);
  text-align: center;
}

input:focus {
  border: 2px solid rgba(0, 0, 0, 0.18);
}

.description {
  width: 100%;
  padding-bottom: 25px;
}

.form-input {
  width: 100%;
  position: relative;
  margin-bottom: 25px;
}

button {
  width: 55%;
  cursor: pointer;
  border-radius: 5em;
  color: #fff;
  border: 0;
  padding: 10px 40px;
  font-size: 13px;
  box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.04);
}

.link {
  cursor: pointer;
  text-shadow: 0px 0px 3px rgba(117, 117, 117, 0.12);
  margin-top: 15px;
}

.error-message {
  width: 100%;
  position: absolute;
  color: red;
  font-size: 12px;
}

@media (max-width: 600px) {
  .main {
    border-radius: 0px;
  }
}
</style>
