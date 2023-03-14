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
                    <p>{{note.date}}</p>  <!-- :class="{completed: item.completed}" -->
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
   <div class="column2">
   <h3>In progress</h3>
        <div class="error" v-for="error in errors">{{error}}</div>
       <ul class="note" v-for="note in column2">
            <li>{{note.title}}  
            <ol>
                <li class="items" v-for="item in note.noteItems" v-if="item.title != null">
                    <span :class="{completed: item.completed}">{{item.title}}</span>
                    <input type="checkbox" @click="changeAchievement(note, item)">  <!-- :class="{completed: item.completed}" -->
                </li>
            </ol>
            </li>
        </ul>
        
        
   </div>
    `,
    methods: {
        changeAchievement(note, item) {
            item.completed = true
            note.status = 0
            let countOfItems = 0
            for(let i = 0; i < 3; i++){
                if (note.noteItems[i].title !== null) {
                    countOfItems++
                }
            }
            for (let i = 0; i < countOfItems; ++i) {
                if (note.noteItems[i].completed === true) {
                    note.status++;
                }
            }
            console.log(note.status)
            if ((note.status / countOfItems) * 100 === 100) {
                eventBus.$emit('addToCol3', note),
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
        column2: {
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
        <div class="error" v-for="error in errors">{{error}}</div>
       <ul class="note" v-for="note in column1">
            <li>{{note.title}}  
            <ol>
                <li class="items" v-for="item in note.noteItems" v-if="item.title != null">
                    <span :class="{completed: item.completed}">{{item.title}}</span>
                    <input type="checkbox" @click="changeAchievement(note, item)">  <!-- :class="{completed: item.completed}" -->
                </li>
            </ol>
            </li>
        </ul>
   </div>
    `,
    methods: {
        changeAchievement(note, item) {
            item.completed = true
            note.status = 0
            let countOfItems = 0
            for(let i = 0; i < 3; i++){
                if (note.noteItems[i].title !== null) {
                    countOfItems++
                    // console.log(countOfItems)
                }
            }
            for (let i = 0; i < countOfItems; ++i) {
                if (note.noteItems[i].completed === true) {
                    note.status++;
                }
            }
            console.log(note.status)
            if ((note.status / countOfItems) * 100 >= 50) {
                eventBus.$emit('addToCol2', note)
            }

        },
    },
})

Vue.component('note-board', {
    template:`
    <div class="noteBoard">
    
        <col1 :column1="column1" :errors="errors"></col1>

        <col2 :column2="column2" :errors="errors"></col2>
        
        <col3 :column3="column3" :errors="errors"></col3>

       
    </div>
`,
    data() {
        return {
            column1: [],
            column2: [],
            column3: [],//не забудь потом еще колонки
            errors: []
        }
    },
    mounted() {
        this.column1 = JSON.parse(localStorage.getItem('column1')) || [];
        eventBus.$on('addToCol1', note => {
            this.errors = []
            if (this.column1.length < 3) {
                this.column1.push(note);
                this.saveColumn1();
            }
            else
                this.errors.push('No more than 3 notes in the first column')
        })
        eventBus.$on('addToCol2', note => {
            this.errors = []
            if (this.column2.length < 5) {
                this.column2.push(note)
                this.column1.splice(this.column1.indexOf(note), 1)
            } else {
                this.errors.push("No more than 5 notes in the second column")
            }
        })
        eventBus.$on('addToCol3', note => {
            this.column3.push(note)
            this.column2.splice(this.column2.indexOf(note), 1)
        })
    },
    methods: {
        saveColumn1(){
            localStorage.setItem('column1', JSON.stringify(this.column1));
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
                    errors: [],
                    status: 0,
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
    },
})


let app = new Vue({
    el: '#app',
    data: {
        name: 'Notes'
    },
})