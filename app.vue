<template>
  <div>
    <NuxtPage/>
  </div>
</template>


<style>

:root {

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    line-height: 1;
    font-family: sans-serif;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul,
  ol {
    list-style: none;
  }


  --primary-bg: #FDFCF9;
  --secondary-bg: #F5F5F5;
  --card-bg: #F1F1F1;
  --card-hover: #FFFFFF;

  --border-color: #d9a200;

  --accent-color: #d9a200;
  --profit-color: #2E7D32;
  --danger-color: #D32F2F;
  --danger-color-hover: rgba(211, 47, 47, 0.5);

  --button-bg: #d9a200;
  --hover-button-bg: #F5B301;
  --button-disabled-bg: #F5B301;
  --cancel-button-bg: #DDDDDD;
  --cancel-hover-button-bg: #c6c6c6;


  --hover-text-color: #2C2C2C;
  --input-field-bg: rgba(223, 223, 223, 0.5);
  --hover-input-field-bg: rgba(223, 223, 223, 0.7);
  --card-border: rgba(102, 102, 102, 0.5);

  --primary-text-color: #2C2C2C;
  --secondary-text-color: #666666;
  --special-text-color: #f5f5f5;

  --error-text: #D32F2F;
  --pending-text: #f57c00;

  --table-header-bg: rgba(245, 179, 1, 0.3);

  --linear-gradient-bg: linear-gradient(135deg, #d9a200 0%, #F5B301 40%, #f7ce4d 70%, #fff7da 100%);

  --heading-1: 40px;
  --heading-2: 32px;
  --heading-3: 24px;
  --heading-4: 20px;
  --body-text: 16px;
  --small-text: 14px;
  --date-text: 12px;
  --text-button-Text: 16px;
  --text-button-small: 14px;
  --placeholder-text: 14px;
  --label-text: 14px;

  --transition: all 0.3s ease-in-out;

  --shadow: rgba(0, 0, 0, 0.1)

}


</style>