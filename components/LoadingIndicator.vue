<template>
  <svg :class="width ? '' : 'loading'" :width="width || 150" viewBox="0 0 800 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <polygon id="wave-1" fill="#2574A9" points="281.901478 0 140.950739 0 0 273.960591 140.950739 273.960591"></polygon>
        <polygon id="wave-2" fill="#19B5FE" points="281.901478 0 140.950739 0 0 273.960591 140.950739 273.960591"></polygon>
        <polygon id="wave-3" fill="#81CFE0" points="281.901478 0 140.950739 0 0 273.960591 140.950739 273.960591"></polygon>
      </g>
  </svg>
</template>

<script>
  export default {
    props: {
      width: Number
    }
  }
</script>

<style lang="scss" scoped>
  .loading {
    width: 10rem;
  }

  @media (max-width: 600px) {
  .loading {
    width: 6rem;
  }
}

  polygon {
    transition: all .5s;
  }

  #wave-1 {
    animation: wave1 ease-in-out 2.5s infinite;
  }

  #wave-2 {
    animation: wave2 ease-in-out 2.5s infinite;
  }

  #wave-3 {
    animation: wave3 ease-in-out 2.5s infinite;
  }

  @keyframes wave1 {
    0% {
      transform: translate(-5.3116%, 9.48%);
      opacity: 0;
    }

    30%, 70% {
      transform: translate(24.6884%, 9.48%);
      opacity: 1;
    }

    100% {
      transform: translate(44.6884%, 9.48%);
      opacity: 0;
    }
  }

  @keyframes wave2 {
    0% {
      transform: translate(0, 0);
      opacity: 0;
    }
    
    20% {
      transform: translate(2.3811%, 23.25%);
      opacity: 0;
    }
    
    50%, 70% {
      transform: translate(32.3811%, 23.25%);
      opacity: 1;
    }

    100% {
      transform: translate(52.3811%, 23.25%);
      opacity: 0;
    }
  }

  @keyframes wave3 {
    0% {
      transform: translate(0, 0);
      opacity: 0;
    }
    
    40% {
      transform: translate(9.0738%, 37.01%);
      opacity: 0;
    }

    70% {
      transform: translate(39.0738%, 37.01%);
      opacity: 1;
    }

    100% {
      transform: translate(59.0738%, 37.01%);
      opacity: 0;
    }
  }
</style> 
