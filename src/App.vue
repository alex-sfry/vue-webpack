<script>
import MainLayout from '@/layouts/MainLayout.vue';

export default {
    components: {
        MainLayout
    },
    data() {
        return {}
    }
}

console.log(process.env.MY_ENV_VARIABLE);
</script>

<template>
    <MainLayout />
</template>
