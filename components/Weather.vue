<template>
  <!-- <span>{{ count.latitude }}</span> -->
  <span v-if="paragraphs">{{ paragraphs.current_weather.temperature }}</span>
  <br>
  <span v-if="paragraphs">{{ paragraphs.current_weather.weathercode }}</span>
</template>

<script setup>
// https://open-meteo.com/en/docs#hourly=temperature_2m,weathercode
const paragraphs = ref()

const { data: page } = await useFetch("https://ipapi.co/json")

watch(
  page,
  (newPage) => {
    if (newPage.latitude) {
      useFetch("https://api.open-meteo.com/v1/forecast", {
        query: {
          latitude: newPage.latitude,
          longitude: newPage.longitude,
          current_weather: true,
        },
      }).then((response)=>{
         paragraphs.value  = response.data.value
      })
    }
  },
  {
    deep: true,
    immediate: true,
  }
)


</script>
