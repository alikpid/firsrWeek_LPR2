let eventBus = new Vue()

Vue.component('note-board', {
    template:`
    <div class="noteBoard">
        <div class="column1">
            <h3>To do</h3>
        </div>

        <div class="column2">
            <h3>In progress</h3>
        </div>

        <div class="column3">
            <h3>Completed</h3>
        </div>
    </div>
`,
    data() {
        return {
            column1: [], //не забудь потом еще колонки
            errors: []
        }
    },
    mounted() {
        eventBus.$on('addToCol1', note => {
            this.errors = []
            if (this.column1.length < 3)
                this.column1.push(note)
            else
                this.errors.push('No more than 3 notes in the first column')
        })
    }
})

Vue.component('new-note', {
    template: `
    <div class="addNote" @submit.prevent="onSubmit">
        <form>
            <h3>Add note</h3>
            
            <p v-if="errorsForm.length">
                 <b>Please correct the following error(s):</b>
                 <ul>
                    <li v-for="errorForm in errorsForm">{{ errorForm }}</li>
                 </ul>
                 <br>
            </p>
            
            <p>
                <label for="title">Title</label>
                <input type="text" id="title" v-model="title">
            </p>
            <p>
                <label for="item1">Item №1</label>
                <input type="text" id="item1" v-model="noteItem1">
            </p>
            <p>
                <label for="item2">Item №2</label>
                <input type="text" id="item2" v-model="noteItem2">
            </p>
            <p>
                <label for="item3">Item №3</label>
                <input type="text" id="item3" v-model="noteItem3">
            </p>

            <button type="submit">Add</button>
        </form>
    </div>

    `,
    data() {
        return {
            title: null,
            noteItem1: null,
            noteItem2: null,
            noteItem3: null,
            errorsForm: [],
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.title && this.noteItem1 && this.noteItem2) {
                let note = {
                    title: this.title,
                    noteItems: [{title: this.noteItem1, completed: false},
                                {title: this.noteItem2, completed: false},
                                {title: this.noteItem3, completed: false}],
                    date: null,

                }
                eventBus.$emit('addToCol1', note)  //добавление в первую колонку
                this.title = null
                this.noteItem1 = null
                this.noteItem2 = null
                this.noteItem3 = null
            } else {
                if(!this.title) this.errorsForm.push("Title required.")
                if(!this.noteItem1) this.errorsForm.push("Sub-item required.")
                if(!this.noteItem2) this.errorsForm.push("Need at least two sub-items")
            }
        }
    }
})


let app = new Vue({
    el: '#app',
    data: {
        name: 'Notes'
    },
    methods: {

    }
})