export default {
  name: "common-page",

  props: {
    color: String,
    texts: {
      type: Object,
      default: () => {},
    },
    response: {
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
    // Options: ["visible", "loading", "hidden"]
    formState: {
      type: String,
      default: "visible",
    },
  },

  data() {
    // Initilize formData
    const formData = {};
    this.inputs.forEach((el) => {
      formData[el.id] = "";
      this.input;
    });
    return { formData: formData, buttonLoader: false };
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
    emptyResponse: function() {
      return Object.keys(this.response).length !== 0 ? false : true;
    },
    pageBackgroundColor: function() {
      return { "background-color": `rgba(${this.normalizedColor}, 0.5)` };
    },
    textColor: function() {
      return { color: `rgb(${this.normalizedColor})` };
    },
    buttonBackgroundColor: function() {
      return { "background-color": `rgba(${this.normalizedColor}, 0.7)` };
    },
    normalizedColor: function() {
      return this.hexToRgb(this.color);
    },
  },

  watch: {
    response: {
      deep: true,
      handler() {
        this.buttonLoader = false;
      },
    },
  },
  methods: {
    hexToRgb(hex) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
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
      // this.$v.$touch();
      // if (this.$v.$invalid) {
      //   this.submitStatus = "ERROR";
      // } else {
        this.buttonLoader = true;
        this.$emit("submit", this.formData);
      // }
    },
  },
};
