<template>
  <client-only>
    <editor
      height=""
      tinymce-script-src="http://localhost:4000/tinymce/js/tinymce/tinymce.min.js"
      :init="{
        height: 700,
        selector: 'textarea',
        menubar: true,
        promotion: false,
        branding: false,
        file_picker_types: 'image',
        plugins:
          'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code wordcount',
        toolbar:
          'undo redo | formatselect | image | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
        license_key: 'gpl',
        content_style: 'body font-family: Prompt, sans-serif;',
      }"
      v-model="componentContent"
    ></editor>
  </client-only>
</template>
<script>
import Editor from "@tinymce/tinymce-vue";

export default {
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  components: {
    Editor,
  },
  data() {
    return {
      componentContent: this.value,
    };
  },
  watch: {
    value(newVal) {
      this.componentContent = newVal;
    },
    componentContent(newVal) {
      this.$emit("input", newVal);
    },
  },
};
</script>
