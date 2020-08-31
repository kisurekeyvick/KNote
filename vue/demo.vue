<template>
    <div>
        <button @click="increment">+</button>
        <button @click="decrement(123, $event)">-</button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            counter: 0
        }
    },
    props: {
        message: {
            type: String,
            default: '123',
            require: true
        },
        obj: {
            type: Object,
            default() {
                return {};
            }
        },
        movies: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    methods: {
        increment() {
            this.counter ++;
        },
        decrement(number, event) {
            this.counter --;
            console.log('传递的参数', number, event);
        }
    },
}
</script>

// parent
<template>
    <Child @item-click="btnClick"/>
</template>
<script>
import Child from '..';
export default {
    data() {
        return {
            
        }
    },
    components: {
        Child
    },
    methods: {
        btnClick(item) {
            console.log(item)
        }
    },
}
</script>

// child
<template>
    <li @click="childClick('123')">123</li>
</template>
<script>
export default {
    template: 'Child',
    data() {
        return {
            
        }
    },
    methods: {
        childClick(item) {
            this.$emit('itemClick', item);
        }
    },
}
</script>
