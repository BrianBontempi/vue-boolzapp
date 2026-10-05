const { createApp } = Vue;

const app = createApp({
    data: () => ({
        user: data.user,
        contacts: data.contacts,
        activeId: 1,
        newMessage: '',
        searchText: '',
        openMenuId: null
    }),
    computed: {
        // contatti filtrati in base al testo cercato
        filteredContacts() {
            const search = this.searchText.toLowerCase();
            return this.contacts.filter(contact => contact.name.toLowerCase().includes(search));
        },
        // contatto attualmente selezionato
        activeContact() {
            return this.contacts.find(contact => contact.id === this.activeId);
        },
        // data dell'ultimo messaggio ricevuto dal contatto attivo
        lastMessageDate() {
            const received = this.activeContact.messages.filter(message => message.status === 'received');
            if (!received.length) return '';
            return received[received.length - 1].date;
        }
    },
    methods: {
        getAvatarUrl(avatar) {
            return `img/avatar${avatar}.jpg`;
        },
        // dalla data 'gg/mm/aaaa hh:mm:ss' ricavo solo 'hh:mm'
        getTime(date) {
            if (!date) return '';
            return date.split(' ')[1].slice(0, 5);
        },
        getLastMessage(contact) {
            const { messages } = contact;
            if (!messages.length) return '';
            return messages[messages.length - 1].text;
        },
        setActiveContact(id) {
            this.activeId = id;
            this.openMenuId = null;
        },
        toggleMenu(id) {
            this.openMenuId = this.openMenuId === id ? null : id;
        },
        deleteMessage(id) {
            this.activeContact.messages = this.activeContact.messages.filter(message => message.id !== id);
            this.openMenuId = null;
        },
        // data attuale nello stesso formato dei dati 'gg/mm/aaaa hh:mm:ss'
        getCurrentDate() {
            const now = new Date();
            const pad = n => String(n).padStart(2, '0');
            const date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
            const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
            return `${date} ${time}`;
        },
        addMessage(contact, text, status) {
            const { messages } = contact;
            const lastId = messages.length ? messages[messages.length - 1].id : 0;

            messages.push({
                id: lastId + 1,
                date: this.getCurrentDate(),
                text,
                status
            });
        },
        sendMessage() {
            if (!this.newMessage) return;

            // salvo il contatto: se nel frattempo cambio chat la risposta arriva comunque a lui
            const contact = this.activeContact;
            this.addMessage(contact, this.newMessage, 'sent');
            this.newMessage = '';

            // risposta automatica dopo 1 secondo
            setTimeout(() => {
                this.addMessage(contact, 'ok', 'received');
            }, 1000);
        }
    }
});

app.mount('#root');
