let eventBus = new Vue()

Vue.component('col3', {
    props: {
        column3: {
            type: Array,
        },
        note: {
            type: Object
        },
        errors: {
            type: Array
        }
    },
    template: `
   <div class="column3">
   <h3>In progress</h3>
        <div class="error" v-for="error in errors">{{error}}</div>
        <ul class="note" v-for="note in column3">
            <li>{{note.title}}  
            <ol>
                <li class="items" v-for="item in note.noteItems" v-if="item.title != null">
                    {{item.title}}
                </li>
                    <span class="dateNote">{{note.date}}</span>  <!-- :class="{completed: item.completed}" -->
            </ol>
            </li>
        </ul>
        
        
   </div>
    `,
})

Vue.component('col2', {
    props: {
        column2: {
            type: Array,
        },
        note: {
            type: Object
        },
        errors2: {
            type: Array
        }
    },

    template: `
   <div class="column2">
   <h3>In progress</h3>
        <div class="error" v-for="error in errors2" :key="error.name">{{error}}</div>
       <ul class="note" v-for="note in column2" :key="note.date">
            <li>{{note.title}}  
            <ol>
                <li class="items" v-for="item in note.noteItems" :key="item.title">
                    <label for="item">{{item.title}}</label>
                    <input type="checkbox" :checked="item.completed" @click="changeAchievement(note, item)" id="item">  <!-- :class="{completed: item.completed}" -->
                </li>
            </ol>
            </li>
        </ul>
        
        
   </div>
    `,
    methods: {
        changeAchievement(note, item) {
            item.completed = true
            note.progress = 0
            for (let i = 0; i < note.noteItems.length; ++i)
                if (note.noteItems[i]?.completed === true)
                    note.progress++;
            if ((note.progress / note.noteItems.length) * 100 === 100) {
                eventBus.$emit('addToCol3', note);
                note.date = new Date().toLocaleString();
            }

        },
    },
})

Vue.component('col1', {
    props: {
        column1: {
            type: Array,
        },
        note: {
            type: Object
        },
        errors: {
            type: Array
        }
    },
    template: `
   <div class="column1">
   <h3>To do</h3>
        <div class="error" v-for="error in errors" :key="error.name">{{error}}</div>
       <ol class="note" v-for="note in column1" :key="note.date">
            <li>{{note.title}}  
            <ol>
                <li class="items" v-for="item in note.noteItems" :key="item.title">
                    <label for="item">{{item.title}}</label>
                    <input type="checkbox" :checked="item.completed" @click="changeAchievement(note, item)" id="item">  <!-- :class="{completed: item.completed}" -->
                </li>
            </ol>
            </li>
        </ol>
   </div>
    `,
    methods: {
        changeAchievement(note, item) {
            item.completed = true
            note.progress = 0

            for (let i = 0; i < note.noteItems.length; ++i)
                if (note.noteItems[i].completed === true)
                    note.progress++;
            if ((note.progress / note.noteItems.length) * 100 >= 50)
                eventBus.$emit('addToCol2', note)
        },
    },
})

Vue.component('note-board', {
    template: `
    <div class="noteBoard">
    
        <col1 :column1="column1" :errors="errors"></col1>

        <col2 :column2="column2" :errors2="errors2"></col2>
        
        <col3 :column3="column3"></col3>

       
    </div>
`,
    data() {
        return {
            column1: [],
            column2: [],
            column3: [],
            errors: [],
            errors2: []
        }
    },
    mounted() {
        this.column1 = JSON.parse(localStorage.getItem('column1')) || [];
        this.column2 = JSON.parse(localStorage.getItem('column2')) || [];
        this.column3 = JSON.parse(localStorage.getItem('column3')) || [];
        eventBus.$on('addToCol1', note => {
            this.errors = []
            if (this.column1.length < 3) {
                this.column1.push(note);
                this.saveColumn1();
            } else
                this.errors.push('No more than 3 notes in the first column')
        })
        eventBus.$on('addToCol2', note => {
            this.errors = []
            if (this.column2.length < 5) {
                this.column2.push(note)
                this.column1.splice(this.column1.indexOf(note), 1)
                this.saveColumn2();
                this.saveColumn1();
            } else {
                this.errors2.push("No more than 5 notes in the second column")

            }
        })
        eventBus.$on('addToCol3', note => {
            this.column3.push(note)
            this.column2.splice(this.column2.indexOf(note), 1)
            this.saveColumn3();
            this.saveColumn2();
        })
    },
    methods: {
        saveColumn1() {
            localStorage.setItem('column1', JSON.stringify(this.column1));
        },
        saveColumn2() {
            localStorage.setItem('column2', JSON.stringify(this.column2));
        },
        saveColumn3() {
            localStorage.setItem('column3', JSON.stringify(this.column3));
        }
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
                <input type="text" id="title" v-model.trim="title">
            </p>
            <p>
                <label for="item1">Item №1</label>
                <input type="text" id="item1" v-model.trim="noteItem1">
            </p>
            <p>
                <label for="item2">Item №2</label>
                <input type="text" id="item2" v-model.trim="noteItem2">
            </p>
            <p>
                <label for="item3">Item №3</label>
                <input type="text" id="item3" v-model.trim="noteItem3">
            </p>
            <p>
                <label for="item4">Item №4</label>
                <input type="text" id="item4" v-model.trim="noteItem4">
            </p>
            <p>
                <label for="item5">Item №5</label>
                <input type="text" id="item5" v-model.trim="noteItem5">
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
            noteItem4: null,
            noteItem5: null,
            errorsForm: [],
            errors: []
        }
    },
    methods: {
        onSubmit() {
            const noteItems = [];
            this.noteItem1 ? noteItems.push({title: this.noteItem1, completed: false}) : "";
            this.noteItem2 ? noteItems.push({title: this.noteItem2, completed: false}) : "";
            this.noteItem3 ? noteItems.push({title: this.noteItem3, completed: false}) : "";
            this.noteItem4 ? noteItems.push({title: this.noteItem4, completed: false}) : "";
            this.noteItem5 ? noteItems.push({title: this.noteItem5, completed: false}) : "";
            if (this.title && this.noteItem1 && this.noteItem2 && this.noteItem3) {
                let note = {
                    title: this.title,
                    noteItems,
                    date: Date.now(),
                    errors: [],
                    progress: 0,
                }
                eventBus.$emit('addToCol1', note)
                this.title = null
                this.noteItem1 = null
                this.noteItem2 = null
                this.noteItem3 = null
                this.noteItem4 = null
                this.noteItem5 = null
            } else {
                if (!this.title) this.errorsForm.push("Title required.")
                if (!this.noteItem1 || !this.noteItem2 || !this.noteItem3) this.errorsForm.push("Need at least three sub-items")
            }
        }
    },
})


let app = new Vue({
    el: '#app',
    data: {
        name: 'Notes'
    },
})