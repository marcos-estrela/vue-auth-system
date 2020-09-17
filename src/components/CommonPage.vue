<template>
  <div class="page" :style="pageBackgroundColor">
    <div class="main">
      <span
        v-if="texts.title"
        class="title"
        :style="textColor"
        align="center"
        >{{ texts.title }}</span
      >
      <transition name="fade">
        <div
          v-if="!emptyResponse"
          class="alert"
          :class="'alert-' + response.type"
        >
          {{ response.message }}
        </div>
      </transition>
      <span v-if="texts.description" class="description">{{
        texts.description
      }}</span>
      <form v-if="formState === 'visible'" @submit.prevent="submit" novalidate>
        <div class="form-input" v-for="input in inputs" :key="input.id">
          <input
            v-model.trim="$v.formData[input.id].$model"
            :style="
              $v.formData[input.id].$dirty && $v.formData[input.id].$invalid
                ? 'border-color: red'
                : ''
            "
            :type="input.type ? input.type : 'text'"
            :placeholder="input.placeholder"
          />
          <div
            class="error-message"
            v-if="
              $v.formData[input.id].$dirty && $v.formData[input.id].$invalid
            "
          >
            {{ errorMessage(input.id) }}
          </div>
        </div>
        <div v-if="texts.button" class="button-slot">
          <transition name="button-fade">
            <button
              v-if="texts.button && !buttonLoader"
              type="submit"
              :style="buttonBackgroundColor"
            >
              {{ texts.button }}
            </button>
          </transition>
          <transition name="button-fade">
            <img v-if="buttonLoader" src="../assets/loader-button.gif" />
          </transition>
        </div>
        <a
          v-for="link in links"
          :key="link.id"
          class="link"
          align="center"
          :href="link.url"
          :style="textColor"
          >{{ link.text }}</a
        >
      </form>
      <div v-else-if="formState === 'loading'">
        <img class="form-loader" src="../assets/form-loader.gif" />
      </div>
    </div>
  </div>
</template>

<script src="./CommonPage.js"></script>
<style src="./CommonPage.css" scoped></style>
