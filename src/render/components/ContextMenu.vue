<template>
    <context-menu v-model:show="show"
                  :options="optionsComponent">
        <context-menu-item label="Test item dynamic show and hide"
                           :clickClose="false"
                           @click="showItem = !showItem" />
        <context-menu-item v-if="showItem"
                           label="Click the item above to show/hide me" />
        <context-menu-sperator v-if="showItem" />
        <context-menu-item :label="itemText"
                           :clickClose="false"
                           @click="changeLabelText" />
    </context-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { MenuOptions } from '@imengyu/vue3-context-menu';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'

export default defineComponent({
    data() {
        return {
            show: false,
            showItem: true,
            itemText: 'Test item dynamic change label',
            optionsComponent: {
                x: 500,
                y: 200
            } as MenuOptions,
        }
    },
    methods: {
        onContextMenu(e: MouseEvent) {
            e.preventDefault();
            //Set the mouse position
            this.optionsComponent.x = e.x;
            this.optionsComponent.y = e.y;
            //Show menu
            this.show = true;
        },
        changeLabelText() {
            this.itemText = (this.itemText == 'My label CHANGED!' ? 'Test item dynamic change label' : 'My label CHANGED!');
        },
    }
});
</script>