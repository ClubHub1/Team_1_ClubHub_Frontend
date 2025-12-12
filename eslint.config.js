import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import vueA11y from "eslint-plugin-vuejs-accessibility"

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"], 
    plugins: { js }, extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser } 
  },
  
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  { files: ["**/*.vue"], 
    languageOptions: { parserOptions: { parser: tseslint.parser } } 
  },
  
  {
  files: ["**/*.vue"],
  plugins: {
    "vuejs-accessibility": vueA11y
  },
  rules: {
    ...vueA11y.configs.recommended.rules,
    "vuejs-accessibility/no-static-element-interactions": "off",
    "vuejs-accessibility/click-events-have-key-events": "off"
  }
}
]);


