
import { getCategoryAPI } from '@/apis/category';
import { onMounted } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { ref } from 'vue';
export function useCategory(){
    const categoryData = ref({});
    const router = useRoute();
    const getCategory = async (id=router.params.id) => {
      const res = await getCategoryAPI(id);
      categoryData.value = res.result;
    };
    onBeforeRouteUpdate((to, from, next) => {
        getCategory(to.params.id);
        next();
    });
    onMounted(() => getCategory())
    return categoryData
}