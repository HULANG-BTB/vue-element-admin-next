<template>
  <li :class="{ completed: todo.done, editing: editing }" class="todo">
    <div class="view">
      <input :checked="todo.done" class="toggle" type="checkbox" @change="toggleTodo(todo)" />
      <label @dblclick="editing = true" v-text="todo.text" />
      <button class="destroy" @click="deleteTodo(todo)" />
    </div>
    <input v-show="editing" v-focus="editing" :value="todo.text" class="edit" @keyup.enter="doneEdit" @keyup.esc="cancelEdit" @blur="doneEdit" />
  </li>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext, nextTick } from 'vue'

export default defineComponent({
  name: 'Todo',
  directives: {
    focus(el, { value }) {
      if (value) {
        nextTick(() => {
          el.focus()
        })
      }
    }
  },
  props: {
    todo: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, context: SetupContext) {
    const editing = ref<boolean>(false)

    const toggleTodo = (todo: any) => {
      context.emit('toggleTodo', todo)
    }

    const deleteTodo = (todo: any) => {
      context.emit('deleteTodo', todo)
    }
    const editTodo = ({ todo, value }: any) => {
      context.emit('editTodo', { todo, value })
    }

    const doneEdit = (e: any) => {
      const value = e.target.value.trim()
      const { todo } = props
      if (!value) {
        deleteTodo({
          todo
        })
      } else if (editing.value) {
        editTodo({
          todo,
          value
        })
        editing.value = false
      }
    }
    const cancelEdit = (e: any) => {
      e.target.value = props.todo.text
      editing.value = false
    }

    return {
      editing,
      toggleTodo,
      deleteTodo,
      editTodo,
      doneEdit,
      cancelEdit
    }
  }
})
</script>

<style lang="scss"></style>
